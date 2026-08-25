<?php
/**
 * Main Template File
 *
 * @package KinetixEnergy
 */

get_header(); ?>

<main id="primary" class="site-main" style="max-width: 1280px; margin: 0 auto; padding: 3rem 1.5rem;">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header" style="margin-bottom: 2rem;">
                    <h1 class="entry-title" style="color: #FFFFFF; font-size: 2.2rem; text-transform: uppercase;"><?php the_title(); ?></h1>
                </header>

                <div class="entry-content" style="color: #9EADA5; line-height: 1.7;">
                    <?php the_content(); ?>
                </div>
            </article>
            <?php
        endwhile;
    endif;
    ?>
</main>

<?php
get_footer();
