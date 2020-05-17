<!DOCTYPE html>

<?php
include 'backend/message.php';
include 'backend/bug.php';
?>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Nedil JS - Contact Me or Report a Bug</title>
	<meta name="description" content="Nedil JS - is a Simple and Complete JavaScript Framework.Works on all modern browsers and provides various APIs to ease the front-end development of a web application" />
	<meta name="keywords" content="NedilJS,Nedil,Nedil JS, JavaScript Framework,APIs,AJAX,CSS Selectors,DOM Manipulation,Data Structures,Animation,Animate,CSS,Style,Widgets,Web Applications" />
	<meta name="robots" content="INDEX,FOLLOW" />
	<link rel="author" href="https://plus.google.com/+SenthilnathanAlakianambiyaPillai/"/>	
	<link rel="publisher" href="https://plus.google.com/+SenthilnathanAlakianambiyaPillai/"/>		
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />	
	<meta property="og:image" content="http://nediljs.com/images/NedilJS-logo-small.png"/>
	<meta property="og:title" content="Nedil JS - A Simple and Complete Javascript Framework" />
	<meta property="og:description" content="Nedil JS - is a Simple and Complete JavaScript Framework.Works on all modern browsers and provides various APIs to ease the front-end development of a web application" />
	<script type="text/javascript">
	<?php
		if($bug_success || $bug_error) {
			echo "var show_bug = true;";
		} else {
			echo "var show_bug = false;";
		}
	?>
	</script>
	<script type="text/javascript" src="js/lib/Nedil.js"></script>

	<link rel="stylesheet" type="text/css" href="css/site/nedil-site-common.css" />
	<link rel="stylesheet" type="text/css" href="css/site/nedil-site-about.css" />
	<link rel="stylesheet" type="text/css" href="css/site/nedil-site-contact.css" />

	<script type="text/javascript" src="js/site/nedil-site-common.js"></script>		
	<script type="text/javascript" src="js/site/nedil-site-contact.js"></script>	
	
</head>
<body>

<div id="site">
	<div id="header">
		<table cellpadding="0" cellspacing="0" width="100%">
		<tr><td>
		<div id="Nedil_JS_logo">
			<a href="index.html"><img src="images/NedilJS-logo-small.png" alt="Nedil JS, A Simple and Complete JavaScript Framework" align="top"/></a>
		</div>
		</td><td>
		<div id="menus">
			<a href="support/tutorials/installation.html"><span class="menu">Documentation</span></a>
			<a href="download.html"><span class="menu">Download</span></a>
			<a href="support/tutorials/aboutdefaultwidgets1.html"><span class="menu">Demo</span></a>		
			<a href="about.html"><span class="menu">About</span></a>
			<a href="contact.php"><span class="menu">Contact</span></a>
		</div>
		
		</td></tr></table>
	</div>
	
	<div id="content">
		<table id="roll" style="width:100%" cellpadding="0" cellspacing="0" border="0">
		<tr><td class="about_tab"><div id="tab1">Contact Me</div></td><td rowspan="3"><div id="tab_cont">
			<div id="roller">
				<div class="content">
				<div class="cont_head">Say "Hi" to Me !!</div>
				<?php 
					if($success) {
						echo "<div class=\"suc_msg_info\" id=\"msg_info\">Thanks for your Message!!!</div>";
					} else if($error) {
						echo "<div class=\"err_msg_info\" id=\"msg_info\">Please provide all the mandatory fields!!!</div>";
					}
				?>
				<form action="contact.php" name="contact_form" id="contact_form" method="post">
					<input type="hidden" name="form_type" value="message" />
					<table class="sub_form" cellpadding="0" cellspacing="0" border="0">
						<tr><td>Name *</td><td><input type="text" name="name" id="name" /></td></tr>
						<tr><td>Email *</td><td><input type="text" name="email" id="email" /></td></tr>
						<tr><td>WebSite</td><td><input type="text" name="website" id="website" /></td></tr>
						<tr><td>Message *</td><td><textarea name="msg" id="msg"></textarea></td></tr>
						<tr><td></td><td><input type="submit" value="Send" /></td></tr>
					</table>
				</form>
				<div class="about_image"><img src="images/download_icons/contact.png" alt="NedilJS Logo" /></div>
				</div>
				<div class="content">
				<div class="cont_head">Hit me in my face !!</div>
				<span style="display: inline-block; font-size:12px; line-height:15px; margin-bottom: 20px;">A bug database will be created and NedilJS code will be moved to github soon to get external contribution. Till then, please report any bugs using the below form.</span>
				<?php 
					if($bug_success) {
						echo "<div class=\"suc_msg_info\" id=\"msg_info\">Thank you for Reporting a bug. Will try to fix them as soon as possible!!!</div>";
					} else if($bug_error) {
						echo "<div class=\"err_msg_info\" id=\"msg_info\">Please provide all the mandatory fields!!!</div>";
					}
				?>				
				<form action="contact.php" name="bug_form" id="bug_form" method="post" enctype="multipart/form-data">
					<input type="hidden" name="form_type" value="bug" />
					<table class="sub_form" cellpadding="0" cellspacing="0" border="0">
						<tr><td>Name *</td><td><input type="text" name="name" id="name" /></td></tr>
						<tr><td>Email * </td><td><input type="text" name="email" id="email"/></td></tr>
						<tr><td>On *</td><td>
							<input type="radio" name="bugon" id="bugon1" style="width:20px" checked="checked" value="nediljs" /><label for="bugon1">NedilJS</label>
							<input type="radio" name="bugon" id="bugon2" style="width:20px" value="widget"/><label for="bugon2">Nedil Widgets</label>
						</td></tr>
						<tr><td>API / Widget </td><td><select name="api" id="api" style="width:200px;"></select> Line no. <input type="text" name="line" id="line" style="width:80px"/></td></tr>
						<tr><td>Description *</td><td><textarea name="msg" id="msg" style="width:600px; height : 100px"></textarea></td></tr>
						<tr><td>ScreenShots</td><td><input type="file" name="attach"/></td></tr>
						<tr><td></td><td><input type="submit" value="Report" /></td></tr>
					</table>
				</form>
				</div>
		</div>
		</div></td></tr>
		<tr><td class="about_tab"><img src="images/download_icons/bug.png" style="position:absolute; width:72px; height: 72px; margin-top: 5px" /><div id="tab2">Report a Bug</div></td></tr>
		<tr><td class="about_tab" style="height:360px;">
			<span>
				<a id="fbshare" href="" target="_blank">
					<img class="share_ic" src="images/download_icons/fb.png" alt="Facebook Share"/>
				</a>
				<a id="twshare" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fparse.com" target="_blank">
					<img class="share_ic" src="images/download_icons/twit.png" alt="Twitter Share"/>
				</a>
				<a id="gpshare" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fparse.com" target="_blank">
					<img class="share_ic" src="images/download_icons/gp.png" alt="Google Plus Share" />
				</a>	
				<a id="linshare" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fparse.com" target="_blank">
					<img class="share_ic" src="images/download_icons/lin.png" alt="LinkedIn Share"/>
				</a>
			</span>
		</td></tr>
		</table>
	</div>
	
	<div id="footer">
		<a href="index.html">Home</a> | 
		<a href="support/tutorials/installation.html">Documentation</a> | 
		<a href="download.html">Download</a> | 
		<a href="support/tutorials/aboutdefaultwidgets1.html">Demo</a> | 
		<a href="about.html">About</a> | 
		<a href="contact.php">Contact Me</a> | 
		<a href="contact.php">Report a Bug</a> 
		<br/>
		<span>NedilJS has been released under <a id="op_license" class="highlight">MIT license</a></span>
	</div>
</div>

</body>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-52388639-1', 'auto');
  ga('send', 'pageview');

</script>
</html>
