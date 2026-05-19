<?php
/**
 * Local WordPress bootstrap for CCI Sabadell.
 *
 * Keeps the local stack simple: standard blog posts only.
 */

if (!defined('ABSPATH')) {
    exit;
}

function cci_headless_register_blog_author_meta() {
    register_post_meta('post', 'cci_blog_author', array(
        'type' => 'string',
        'single' => true,
        'default' => '',
        'show_in_rest' => true,
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));
}
add_action('init', 'cci_headless_register_blog_author_meta');

function cci_headless_enable_post_features() {
    add_theme_support('post-thumbnails');
    add_post_type_support('post', 'excerpt');
}
add_action('after_setup_theme', 'cci_headless_enable_post_features');

function cci_headless_add_blog_author_metabox() {
    add_meta_box(
        'cci-blog-author',
        __('Autor del blog', 'cci-headless-local'),
        'cci_headless_render_blog_author_metabox',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'cci_headless_add_blog_author_metabox');

function cci_headless_render_blog_author_metabox($post) {
    wp_nonce_field('cci_headless_save_blog_author', 'cci_headless_blog_author_nonce');

    $value = get_post_meta($post->ID, 'cci_blog_author', true);

    echo '<p>' . esc_html__('Nombre que se mostrará como autor del blog en la web.', 'cci-headless-local') . '</p>';
    echo '<input type="text" style="width:100%;" name="cci_blog_author" value="' . esc_attr($value) . '" placeholder="Ej: Pastor Luis García" />';
}

function cci_headless_save_blog_author_meta($post_id) {
    if (!isset($_POST['cci_headless_blog_author_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['cci_headless_blog_author_nonce'])), 'cci_headless_save_blog_author')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (!isset($_POST['cci_blog_author'])) {
        return;
    }

    $value = sanitize_text_field(wp_unslash($_POST['cci_blog_author']));
    update_post_meta($post_id, 'cci_blog_author', $value);
}
add_action('save_post_post', 'cci_headless_save_blog_author_meta');

function cci_headless_post_template($args, $post_type) {
    if ('post' !== $post_type) {
        return $args;
    }

    $args['template'] = array(
        array('core/heading', array(
            'level' => 2,
            'placeholder' => 'Título interno de la sección o subtítulo del blog...',
        )),
        array('core/paragraph', array(
            'placeholder' => 'Escribe aquí la introducción o resumen del blog...',
        )),
        array('core/image', array(
            'align' => 'wide',
            'sizeSlug' => 'large',
            'linkDestination' => 'none',
        )),
        array('core/paragraph', array(
            'placeholder' => 'Desarrolla aquí el contenido completo del blog...',
        )),
        array('core/gallery', array(
            'columns' => 3,
            'linkTo' => 'none',
            'sizeSlug' => 'large',
        )),
    );

    $args['template_lock'] = false;

    return $args;
}
add_filter('register_post_type_args', 'cci_headless_post_template', 10, 2);

function cci_headless_register_blog_pattern() {
    if (!function_exists('register_block_pattern')) {
        return;
    }

    register_block_pattern(
        'cci-headless/blog-entry-template',
        array(
            'title'       => __('Plantilla de blog CCI', 'cci-headless-local'),
            'description' => __('Estructura base para crear una entrada del blog con imagen, galería y contenido.', 'cci-headless-local'),
            'categories'  => array('text'),
            'content'     => '<!-- wp:heading {"level":2} -->\n<h2>Título interno de la sección o subtítulo del blog...</h2>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>Escribe aquí la introducción o resumen del blog...</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:image {"align":"wide"} -->\n<figure class="wp-block-image alignwide"><img alt="" /></figure>\n<!-- /wp:image -->\n\n<!-- wp:paragraph -->\n<p>Desarrolla aquí el contenido completo del blog...</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:gallery {"columns":3,"linkTo":"none"} -->\n<figure class="wp-block-gallery has-nested-images columns-3 is-cropped"></figure>\n<!-- /wp:gallery -->',
        )
    );
}
add_action('init', 'cci_headless_register_blog_pattern');

function cci_headless_seed_blog_content() {
    if (get_option('cci_headless_seed_complete')) {
        return;
    }

    update_option('show_on_front', 'posts');
    delete_option('page_on_front');

    $posts = array(
        array(
            'title' => 'Caminar con fe en tiempos inciertos',
            'slug' => 'caminar-con-fe-en-tiempos-inciertos',
            'content' => '<p>La fe no elimina la incertidumbre, pero nos enseña a caminar con confianza.</p><p>Dios permanece fiel y su cuidado no falla.</p>',
        ),
        array(
            'title' => 'La comunidad como lugar de sanidad',
            'slug' => 'la-comunidad-como-lugar-de-sanidad',
            'content' => '<p>La iglesia es un espacio donde aprendemos a servir, escuchar y acompañarnos.</p><p>En comunidad, Dios también restaura.</p>',
        ),
        array(
            'title' => 'La alegría de servir a Cristo',
            'slug' => 'la-alegria-de-servir-a-cristo',
            'content' => '<p>Servir a Cristo es un privilegio que llena de propósito la vida cotidiana.</p><p>Su amor nos impulsa a dar con generosidad y esperanza.</p>',
        ),
    );

    foreach ($posts as $post) {
        $existing = get_page_by_path($post['slug'], OBJECT, 'post');

        if ($existing) {
            continue;
        }

        wp_insert_post(array(
            'post_type' => 'post',
            'post_title' => $post['title'],
            'post_name' => $post['slug'],
            'post_status' => 'publish',
            'post_content' => $post['content'],
            'post_excerpt' => wp_strip_all_tags($post['content']),
        ));
    }

    update_option('cci_headless_seed_complete', 1);
}
add_action('init', 'cci_headless_seed_blog_content', 20);
