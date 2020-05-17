<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <main id="main">
 *
 * @package Coller
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="hfeed site">
	<?php do_action( 'coller-before' ); ?>
	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding">
<?php if((of_get_option('logo', true) != "") && (of_get_option('logo', true) != 1) ) { ?>
			<h1 class="site-title logo-container"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
      <?php
			echo "<img class='main_logo' src='".of_get_option('logo', true)."' title='".esc_attr(get_bloginfo( 'name','display' ) )."'></a></h1>";	
			}
		else { ?>
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1> 
		<?php	
		}
		?>
		</div>
        
        <div id="social_icons">
		    <?php if ( of_get_option('facebook', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('facebook', true); ?>" title="Facebook" ><img src="<?php echo get_template_directory_uri()."/images/facebook.png"; ?>"></a>
             <?php } ?>
            <?php if ( of_get_option('twitter', true) != "") { ?>
			 <a target="_blank" href="http://twitter.com/<?php echo of_get_option('twitter', true); ?>" title="Twitter" ><img src="<?php echo get_template_directory_uri()."/images/twitter.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('google', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('google', true); ?>" title="Google Plus" ><img src="<?php echo get_template_directory_uri()."/images/google.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('pinterest', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('pinterest', true); ?>" title="Pinterest" ><img src="<?php echo get_template_directory_uri()."/images/pinterest.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('linkedin', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('linkedin', true); ?>" title="Linked In" ><img src="<?php echo get_template_directory_uri()."/images/linkedin.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('instagram', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('instagram', true); ?>" title="Instagram" ><img src="<?php echo get_template_directory_uri()."/images/instagram.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('youtube', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('youtube', true); ?>" title="YouTube" ><img src="<?php echo get_template_directory_uri()."/images/youtube.png"; ?>"></a>
             <?php } ?>
             <?php if ( of_get_option('feedburner', true) != "") { ?>
			 <a target="_blank" href="<?php echo of_get_option('feedburner', true); ?>" title="RSS Feed" ><img src="<?php echo get_template_directory_uri()."/images/rss.png"; ?>"></a>
             <?php } ?>
          </div>	
        
	</header><!-- #masthead -->
    
       <nav id="site-navigation" class="main-navigation" role="navigation">
         <div id="nav-container">
			<h1 class="menu-toggle"><?php _e( 'Menu', 'coller' ); ?></h1>
			<div class="screen-reader-text skip-link"><a href="#content" title="<?php esc_attr_e( 'Skip to content', 'coller' ); ?>"><?php _e( 'Skip to content', 'coller' ); ?></a></div>

			<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
          </div>  
		</nav><!-- #site-navigation -->
        

	<div id="content" class="site-content">
    <?php
    if ( (function_exists( 'of_get_option' )) && (of_get_option('slidetitle5',true) !=1) ) {
	if ( ( of_get_option('slider_enabled') != 0 ) && ( (is_home() == true) || (is_front_page() ==true) ) )  
		{ ?>
    <div id="slider-wrapper">
    <ul class="bxslider">
    	<?php
		  		$slider_flag = false;
		  		for ($i=1;$i<6;$i++) {
					if ( of_get_option('slide'.$i, true) != "" ) {
						echo "<li><a href='".esc_url(of_get_option('slideurl'.$i, true))."'><img src='".of_get_option('slide'.$i, true)."' title='".of_get_option('slidetitle'.$i, true)."'></a></li>";    
						$slider_flag = true;
					}
				}
           ?>
     </ul>   
	</div>
    
    <?php } 
	}
?>