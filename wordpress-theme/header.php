<?php
/**
 * The header for Kinetix Energy Theme
 *
 * @package KinetixEnergy
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('kinetix-energy-theme'); ?>>
<?php wp_body_open(); ?>

<header class="site-header" style="background: #0E1311; border-bottom: 1px solid #24302A; position: sticky; top: 0; z-index: 999;">
    <!-- Top Engineering Utility Bar -->
    <div style="background: #141A17; border-bottom: 1px solid #1B2420; padding: 6px 1.5rem; font-size: 11px; font-family: monospace; color: #9EADA5;">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span style="color: #10B981;">● SANS 10142-1-2 Certified Installation</span>
                <span style="color: #6B7B73;">|</span>
                <span>South African SSEG Registered</span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <a href="<?php echo esc_url(home_url('/tracking')); ?>" style="color: #9EADA5; text-decoration: none;">Track Project</a>
                <span style="color: #6B7B73;">|</span>
                <a href="<?php echo esc_url(home_url('/customer-portal')); ?>" style="color: #E6ECE8; text-decoration: none; font-weight: bold;">Client Portal</a>
            </div>
        </div>
    </div>

    <!-- Main Clean Navigation Bar -->
    <div style="max-width: 1280px; margin: 0 auto; padding: 0.85rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div class="site-branding">
            <a href="<?php echo esc_url(home_url('/')); ?>" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
                <div style="width: 34px; height: 34px; background: #1B4D3E; border: 1px solid #286D58; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">⚡</div>
                <div style="display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 1.15rem; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.02em;">KINETIX</span>
                    <span style="font-size: 1.15rem; font-weight: 300; color: #9EADA5; text-transform: uppercase;">ENERGY</span>
                </div>
            </a>
        </div>

        <nav class="main-navigation" style="display: flex; gap: 1.5rem; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
            <a href="<?php echo esc_url(home_url('/solar-solutions')); ?>" style="color: #9EADA5; text-decoration: none;">Solutions</a>
            <a href="<?php echo esc_url(home_url('/shop')); ?>" style="color: #9EADA5; text-decoration: none;">Shop</a>
            <a href="<?php echo esc_url(home_url('/installation')); ?>" style="color: #9EADA5; text-decoration: none;">Installation</a>
            <a href="<?php echo esc_url(home_url('/maintenance')); ?>" style="color: #9EADA5; text-decoration: none;">Maintenance</a>
            <a href="<?php echo esc_url(home_url('/energy-calculator')); ?>" style="color: #9EADA5; text-decoration: none;">Calculator</a>
            <a href="<?php echo esc_url(home_url('/about')); ?>" style="color: #9EADA5; text-decoration: none;">About</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" style="color: #9EADA5; text-decoration: none;">Contact</a>
        </nav>

        <div>
            <a href="<?php echo esc_url(home_url('/solar-configurator')); ?>" class="vx-btn-primary" style="font-size: 11px; font-family: monospace; text-decoration: none;">
                Get a Solar Quote
            </a>
        </div>
    </div>
</header>
<div id="content" class="site-content" style="min-height: 70vh;">
