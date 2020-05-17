<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'nediljsc_wp908');

/** MySQL database username */
define('DB_USER', 'nediljsc_wp908');

/** MySQL database password */
define('DB_PASSWORD', 'T]9BS(96Pu');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'rym1zfx5uf27bwxgtkaosdglfsvp6s8vmwsljxpqnve3spejnuq9yijvkwfc3l55');
define('SECURE_AUTH_KEY',  'hx94lvntgcl47hcbgv7p1mpzexfaezt82eigqbsl4q8wrfirwevrwn3indvfft2a');
define('LOGGED_IN_KEY',    'xilqgsid90qbhjekujwhubdpx5vse4jwz7eaborf4fgxmh9ventlx0ks8gmd5jyc');
define('NONCE_KEY',        'xdbkv4a5j7q8rntdgdqfszonoyaw1rie00xc8rnieo0vmjokiebzuqmbbhruqdw7');
define('AUTH_SALT',        'lrzw9uviy1rljr5lxymiebfkbj7zqxqfpzzqydguv6bcnbuxecdnmyu9dreinq8x');
define('SECURE_AUTH_SALT', 'garbwjrxzqkrmidemfhkwekd1ejjo10wm85zx8hf987o2rgkzzmtoowbf6r7fttt');
define('LOGGED_IN_SALT',   'crkscvayksod30i8q5nvbnu2lywmj6407ledgll57dwlh1on9jnplhvuog3tgz9g');
define('NONCE_SALT',       'znkkbvp4qsxyvzmr8n0lryuqbg0rhno8coeaqbusareayv8spiz8lx18pd1cb3sk');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wpz4_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
