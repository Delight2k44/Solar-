<?php
/**
 * Kinetix Energy Child Theme Functions & Definitions
 *
 * @package KinetixEnergy
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Enqueue Styles and Scripts
 */
function kinetix_energy_enqueue_scripts() {
    // Parent theme style
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');

    // Child theme style
    wp_enqueue_style('kinetix-energy-style', get_stylesheet_uri(), array('parent-style'), '1.0.0');

    // Google Fonts: Plus Jakarta Sans & JetBrains Mono
    wp_enqueue_style(
        'kinetix-fonts',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
        array(),
        null
    );

    // Enqueue custom frontend interactive bundle if present
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
 * Register Custom Post Types for Energy Management
 */
function kinetix_energy_register_cpts() {
    // 1. Projects & Installations (For Milestone Tracking)
    $project_labels = array(
        'name'               => _x('Projects & Orders', 'post type general name', 'kinetix-energy'),
        'singular_name'      => _x('Project', 'post type singular name', 'kinetix-energy'),
        'menu_name'          => _x('Kinetix Projects', 'admin menu', 'kinetix-energy'),
        'add_new'            => _x('Add New Project', 'project', 'kinetix-energy'),
        'add_new_item'       => __('Add New Installation Project', 'kinetix-energy'),
        'edit_item'          => __('Edit Project', 'kinetix-energy'),
        'new_item'           => __('New Project', 'kinetix-energy'),
        'view_item'          => __('View Project', 'kinetix-energy'),
        'search_items'       => __('Search Projects', 'kinetix-energy'),
        'not_found'          => __('No projects found', 'kinetix-energy'),
    );

    $project_args = array(
        'labels'             => $project_labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'tracking'),
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 25,
        'menu_icon'          => 'dashicons-dashboard',
        'supports'           => array('title', 'editor', 'custom-fields'),
        'show_in_rest'       => true,
    );
    register_post_type('kinetix_project', $project_args);

    // 2. Maintenance SLAs & Service Tickets
    $service_labels = array(
        'name'          => _x('Maintenance SLAs', 'post type general name', 'kinetix-energy'),
        'singular_name' => _x('Maintenance SLA', 'post type singular name', 'kinetix-energy'),
        'menu_name'     => _x('Maintenance SLAs', 'admin menu', 'kinetix-energy'),
    );

    $service_args = array(
        'labels'        => $service_labels,
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'menu_icon'     => 'dashicons-hammer',
        'supports'      => array('title', 'editor', 'custom-fields'),
        'show_in_rest'  => true,
    );
    register_post_type('kinetix_maintenance', $service_args);
}
add_action('init', 'kinetix_energy_register_cpts');

/**
 * WooCommerce: Add "Turnkey Installation & CoC" Option to Product Pages
 */
function kinetix_add_installation_option_field() {
    global $product;
    if (!$product) return;

    $price = get_post_meta($product->get_id(), '_installation_price', true);
    if (!$price) {
        $price = 8500; // Standard fallback estimate
    }

    echo '<div class="kinetix-installation-addon" style="margin: 1.5rem 0; padding: 1rem; background: #141A17; border: 1px solid #24302A; border-radius: 6px;">';
    echo '<label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; color: #E6ECE8; font-size: 0.85rem;">';
    echo '<span><input type="checkbox" name="kinetix_add_installation" value="yes" style="margin-right: 8px;"> <strong>Add Certified Installation & SANS 10142 CoC</strong></span>';
    echo '<span style="font-family: monospace; color: #D97706; font-weight: bold;">+ R ' . number_format($price, 2) . '</span>';
    echo '</label>';
    echo '<p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #9EADA5;">Includes mechanical roof rail mounting, DC/AC protection box, and electrician certification.</p>';
    echo '</div>';
}
add_action('woocommerce_before_add_to_cart_button', 'kinetix_add_installation_option_field');

/**
 * Custom REST API Endpoint for South African Solar Sizing Models
 */
add_action('rest_api_init', function () {
    register_rest_route('kinetix/v1', '/calculate-solar', array(
        'methods'             => 'POST',
        'callback'            => 'kinetix_rest_calculate_solar',
        'permission_callback' => '__return_true',
    ));
});

function kinetix_rest_calculate_solar($request) {
    $params = $request->get_json_params();
    $monthly_bill = isset($params['monthly_bill']) ? floatval($params['monthly_bill']) : 4000;
    $province = isset($params['province']) ? sanitize_text_field($params['province']) : 'Gauteng';

    $peak_sun_hours = ($province === 'Western Cape') ? 5.1 : (($province === 'Northern Cape') ? 6.2 : 5.4);
    $tariff_kwh = 3.45;
    $monthly_kwh = $monthly_bill / $tariff_kwh;
    $daily_kwh = $monthly_kwh / 30;

    $required_solar_kwp = round(($daily_kwh * 0.8) / ($peak_sun_hours * 0.82), 2);
    $inverter_kva = ($required_solar_kwp > 8.0) ? 12 : (($required_solar_kwp > 4.5) ? 8 : 5);
    $battery_kwh = ($monthly_bill > 8000) ? 15.36 : (($monthly_bill > 4500) ? 10.24 : 5.12);

    return rest_ensure_response(array(
        'success'             => true,
        'monthly_kwh'         => round($monthly_kwh),
        'recommended_inverter' => $inverter_kva . ' kVA',
        'recommended_solar'   => $required_solar_kwp . ' kWp',
        'recommended_battery' => $battery_kwh . ' kWh',
        'disclaimer'          => 'These figures are estimates and should not be treated as a final quotation or engineering assessment.'
    ));
}
