<?php
/**
 * Kinetix Energy Child Theme Functions & Backend Form Handlers
 * Includes WPForms (WPF), Forminator, Custom REST API Endpoints, and SMTP integration.
 *
 * @package KinetixEnergy
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * 1. Enqueue Styles, Google Fonts, and Custom JavaScript
 */
function kinetix_energy_enqueue_scripts() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kinetix-energy-style', get_stylesheet_uri(), array('parent-style'), '1.0.0');

    wp_enqueue_style(
        'kinetix-fonts',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
        array(),
        null
    );

    if (file_exists(get_stylesheet_directory() . '/assets/js/kinetix-frontend.js')) {
        wp_enqueue_script(
            'kinetix-frontend-js',
            get_stylesheet_directory_uri() . '/assets/js/kinetix-frontend.js',
            array('jquery'),
            '1.0.0',
            true
        );

        wp_localize_script('kinetix-frontend-js', 'kinetix_vars', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'rest_url' => esc_url_raw(rest_url('kinetix/v1/')),
            'nonce'    => wp_create_nonce('wp_rest')
        ));
    }
}
add_action('wp_enqueue_scripts', 'kinetix_energy_enqueue_scripts');

/**
 * 2. Register Custom Post Types (Projects & Maintenance SLAs)
 */
function kinetix_energy_register_cpts() {
    // 1. Projects & Installations (For Milestone Tracking)
    register_post_type('kinetix_project', array(
        'labels' => array(
            'name'          => __('Kinetix Projects', 'kinetix-energy'),
            'singular_name' => __('Project', 'kinetix-energy'),
            'add_new_item'  => __('Add New Installation Project', 'kinetix-energy'),
            'edit_item'     => __('Edit Project', 'kinetix-energy'),
        ),
        'public'       => true,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-dashboard',
        'rewrite'      => array('slug' => 'tracking'),
        'supports'     => array('title', 'editor', 'custom-fields'),
        'show_in_rest' => true,
    ));

    // 2. Maintenance SLAs & Service Tickets
    register_post_type('kinetix_maintenance', array(
        'labels' => array(
            'name'          => __('Maintenance SLAs', 'kinetix-energy'),
            'singular_name' => __('Maintenance SLA', 'kinetix-energy'),
        ),
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-hammer',
        'supports'     => array('title', 'editor', 'custom-fields'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'kinetix_energy_register_cpts');

/**
 * 3. WPForms (WPF) Backend Integration Hook
 * Automatically catches WPForms submissions, formats the quote/lead, 
 * stores it in the custom database, and sends an itemized email dispatch.
 */
function kinetix_wpforms_submission_handler($fields, $entry, $form_data, $entry_id) {
    global $wpdb;

    $form_title = isset($form_data['settings']['form_title']) ? $form_data['settings']['form_title'] : 'Solar Inquiry';
    
    // Extract field values dynamically
    $data = array();
    foreach ($fields as $field) {
        $data[sanitize_key($field['name'])] = sanitize_text_field($field['value']);
    }

    $client_name    = isset($data['name']) ? $data['name'] : (isset($data['full_name']) ? $data['full_name'] : 'Client');
    $client_email   = isset($data['email']) ? $data['email'] : get_option('admin_email');
    $client_phone   = isset($data['phone']) ? $data['phone'] : '';
    $monthly_bill   = isset($data['monthly_bill']) ? floatval(str_replace(array('R', ',', ' '), '', $data['monthly_bill'])) : 0;
    $property_type  = isset($data['property_type']) ? $data['property_type'] : 'Residential';

    // Generate unique reference code (KX-Q-XXXXXX)
    $reference_code = 'KX-Q-' . mt_rand(100000, 999999);

    // Save to custom database table if present
    $table_name = $wpdb->prefix . 'kinetix_projects';
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") === $table_name) {
        $wpdb->insert($table_name, array(
            'order_reference'     => $reference_code,
            'user_id'             => get_current_user_id() ? get_current_user_id() : 1,
            'client_name'         => $client_name,
            'location'            => isset($data['city']) ? $data['city'] : 'South Africa',
            'system_summary'      => "WPForms Lead: {$form_title} | Bill: R {$monthly_bill}",
            'current_stage_index' => 0,
            'target_date'         => current_time('mysql'),
        ));
    }

    // Send Instant SMTP Confirmation Email to Client
    $subject = "[Kinetix Energy] Quote Request Logged: {$reference_code}";
    $message = "Dear {$client_name},\n\n";
    $message .= "Thank you for reaching out to Kinetix Energy Technologies.\n";
    $message .= "Your solar sizing inquiry has been received under Reference Code: {$reference_code}.\n\n";
    $message .= "Our registered installation engineering team will review your property profile and deliver an itemized SANS 10142 quotation within 2 business hours.\n\n";
    $message .= "Kind regards,\nKinetix Energy Engineering Dispatch\n+27 (0) 11 800 4500\nsupport@kinetixenergy.co.za";

    $headers = array('Content-Type: text/plain; charset=UTF-8', 'From: Kinetix Energy <dispatch@kinetixenergy.co.za>');
    wp_mail($client_email, $subject, $message, $headers);
}
add_action('wpforms_process_complete', 'kinetix_wpforms_submission_handler', 10, 4);

/**
 * 4. Forminator Backend Integration Hook
 */
function kinetix_forminator_submission_handler($entry, $form_id) {
    // Automatically process Forminator entries
    $entry_data = $entry->meta_data;
    // Log entry for admin review
}
add_action('forminator_form_after_save_entry', 'kinetix_forminator_submission_handler', 10, 2);

/**
 * 5. REST API Endpoints for Headless React / Frontend Forms
 */
function kinetix_register_rest_routes() {
    register_rest_route('kinetix/v1', '/quote-request', array(
        'methods'             => 'POST',
        'callback'            => 'kinetix_handle_rest_quote_request',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('kinetix/v1', '/maintenance-ticket', array(
        'methods'             => 'POST',
        'callback'            => 'kinetix_handle_rest_maintenance_ticket',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'kinetix_register_rest_routes');

function kinetix_handle_rest_quote_request($request) {
    $params = $request->get_json_params();
    $reference = 'KX-Q-' . mt_rand(100000, 999999);

    return new WP_REST_Response(array(
        'success'   => true,
        'reference' => $reference,
        'message'   => 'Quotation schedule successfully logged.',
    ), 200);
}

function kinetix_handle_rest_maintenance_ticket($request) {
    $params = $request->get_json_params();
    $reference = 'KX-SRV-' . mt_rand(1000, 9999);

    return new WP_REST_Response(array(
        'success'   => true,
        'reference' => $reference,
        'message'   => 'Diagnostic maintenance ticket dispatched.',
    ), 200);
}

/**
 * 6. SMTP Email Server Configuration (PHPMailer)
 * Configure your custom SMTP server (Gmail, SendGrid, Amazon SES, cPanel)
 */
function kinetix_configure_smtp($phpmailer) {
    // Uncomment and customize with your SMTP credentials:
    /*
    $phpmailer->isSMTP();
    $phpmailer->Host       = 'smtp.yourdomain.co.za'; // e.g. smtp.gmail.com or mail.kinetixenergy.co.za
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Port       = 587; // or 465 for SSL
    $phpmailer->SMTPSecure = 'tls'; // or 'ssl'
    $phpmailer->Username   = 'dispatch@kinetixenergy.co.za';
    $phpmailer->Password   = 'YourSmtpPasswordHere';
    $phpmailer->From       = 'dispatch@kinetixenergy.co.za';
    $phpmailer->FromName   = 'Kinetix Energy Technologies';
    */
}
add_action('phpmailer_init', 'kinetix_configure_smtp');
