<?php
/**
 * The footer for Kinetix Energy Theme
 *
 * @package KinetixEnergy
 */
?>
</div><!-- #content -->

<footer class="site-footer" style="background: #0A0E0C; border-top: 1px solid #24302A; color: #9EADA5; font-size: 0.8rem; padding: 4rem 1.5rem 2rem 1.5rem;">
    <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <div>
            <h4 style="color: #fff; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem;">KINETIX ENERGY</h4>
            <p style="font-size: 0.8rem; line-height: 1.6; color: #9EADA5;">
                Turnkey South African renewable energy engineering platform. SABS-compliant solar PV, battery storage, and lifetime service agreements.
            </p>
            <div style="margin-top: 1rem; font-family: monospace; font-size: 0.75rem; color: #6B7B73;">
                <div>National Operations: [Phone Placeholder]</div>
                <div>Proposals Desk: [Email Placeholder]</div>
            </div>
        </div>

        <div>
            <h4 style="color: #fff; font-size: 0.8rem; font-family: monospace; text-transform: uppercase; margin-bottom: 1rem;">Solutions</h4>
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                <li><a href="<?php echo esc_url(home_url('/solar-solutions')); ?>" style="color: #9EADA5; text-decoration: none;">Residential Hybrid Solar</a></li>
                <li><a href="<?php echo esc_url(home_url('/solar-solutions')); ?>" style="color: #9EADA5; text-decoration: none;">Commercial 3-Phase Solar</a></li>
                <li><a href="<?php echo esc_url(home_url('/installation')); ?>" style="color: #9EADA5; text-decoration: none;">Installation & CoC</a></li>
                <li><a href="<?php echo esc_url(home_url('/maintenance')); ?>" style="color: #9EADA5; text-decoration: none;">Preventative Maintenance SLAs</a></li>
            </ul>
        </div>

        <div>
            <h4 style="color: #fff; font-size: 0.8rem; font-family: monospace; text-transform: uppercase; margin-bottom: 1rem;">Engineering Tools</h4>
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                <li><a href="<?php echo esc_url(home_url('/solar-configurator')); ?>" style="color: #9EADA5; text-decoration: none;">Solar Sizing Configurator</a></li>
                <li><a href="<?php echo esc_url(home_url('/energy-calculator')); ?>" style="color: #9EADA5; text-decoration: none;">Energy & Payback Calculator</a></li>
                <li><a href="<?php echo esc_url(home_url('/tracking')); ?>" style="color: #9EADA5; text-decoration: none;">Project Tracking Portal</a></li>
                <li><a href="<?php echo esc_url(home_url('/resources')); ?>" style="color: #9EADA5; text-decoration: none;">Guides & SANS Glossary</a></li>
            </ul>
        </div>

        <div>
            <h4 style="color: #fff; font-size: 0.8rem; font-family: monospace; text-transform: uppercase; margin-bottom: 1rem;">Future Horizon</h4>
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 2; font-family: monospace; font-size: 0.75rem; color: #6B7B73;">
                <li>Solar PV Array (Active)</li>
                <li>LiFePO4 Storage (Active)</li>
                <li>Micro-Wind Turbines (Coming Soon)</li>
                <li>Biogas Cogeneration (Coming Soon)</li>
            </ul>
        </div>
    </div>

    <div style="max-width: 1280px; margin: 0 auto; border-top: 1px solid #1B2420; padding-top: 1.5rem; display: flex; justify-content: space-between; font-family: monospace; font-size: 0.7rem; color: #6B7B73;">
        <div>© <?php echo date('Y'); ?> KINETIX ENERGY TECHNOLOGIES (PTY) LTD.</div>
        <div>SANS 10142-1-2 • SSEG Compliant</div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
