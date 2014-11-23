<!DOCTYPE html>
<html>
<head>
	<meta name="description" content="Skookul: Transportation, Music, Food and the Outdoors in Philadelphia, PA" />
	<meta name="keywords" content="Philadelphia, septa buses, septa, setpa trolleys, septa trolley locations, septa trains, septa bus locations, septa train locations, transportation, Philly, Skookul, events, things to do in Philly, philly music, philly food, philly outdoors" />
	<title>Real time SEPTA bus, trolley and trains in Philadelphia, PA - Skookul.com</title>
	<?php include("includes/css-js.php"); ?>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAz-ny_9bW2VkZfL-K7baYnu2Jpqs02hSU&sensor=false"></script>
	<!-- <script src="js/transportation-min.js?cc=02-23-2013"></script> -->
	<script src="js/transportation.js"></script>
</head>
<body id="transportation">
	<div id="wrapper">
		<?php include("includes/header.php"); ?>
		<div id="main_content_section">
			<div class="left-col">
				<h2>
					SEPTA Real Time Locator
				</h2>
				<p>
					<small>Data provided by Septa may be delayed several minutes</small>
				</p>
				<nav>
					<a href="javascript:void(0)" rel="bus">Buses</a> 
					<a href="javascript:void(0)" rel="train">Trains</a> 
					<a href="javascript:void(0)" rel="trolley">Trolleys</a>
					<span class="loading-container"></span>
					<div class="locateUser" alt="Find me" title="Find me">
						Find me
					</div>
				</nav>
				<div class="grid">
					<div class="bus">
						<div class="grid-cell" rel="1">1</div>			
						<div class="grid-cell" rel="2">2</div>			
						<div class="grid-cell" rel="3">3</div>
						<div class="grid-cell" rel="4">4</div>					
						<div class="grid-cell" rel="5">5</div>			
						<div class="grid-cell" rel="6">6</div>			
						<div class="grid-cell" rel="7">7</div>			
						<div class="grid-cell" rel="8">8</div>			
						<div class="grid-cell" rel="9">9</div>			
						<div class="grid-cell" rel="12">12</div>			
						<div class="grid-cell" rel="14">14</div>			
						<div class="grid-cell" rel="17">17</div>			
						<div class="grid-cell" rel="18">18</div>			
						<div class="grid-cell" rel="19">19</div>			
						<div class="grid-cell" rel="20">20</div>			
						<div class="grid-cell" rel="21">21</div>			
						<div class="grid-cell" rel="22">22</div>			
						<div class="grid-cell" rel="23">23</div>			
						<div class="grid-cell" rel="24">24</div>			
						<div class="grid-cell" rel="25">25</div>			
						<div class="grid-cell" rel="26">26</div>			
						<div class="grid-cell" rel="27">27</div>			
						<div class="grid-cell" rel="28">28</div>			
						<div class="grid-cell" rel="29">29</div>			
						<div class="grid-cell" rel="30">30</div>			
						<div class="grid-cell" rel="31">31</div>			
						<div class="grid-cell" rel="32">32</div>			
						<div class="grid-cell" rel="33">33</div>			
						<div class="grid-cell" rel="35">35</div>			
						<div class="grid-cell" rel="37">37</div>			
						<div class="grid-cell" rel="38">38</div>			
						<div class="grid-cell" rel="39">39</div>			
						<div class="grid-cell" rel="40">40</div>			
						<div class="grid-cell" rel="42">42</div>			
						<div class="grid-cell" rel="43">43</div>			
						<div class="grid-cell" rel="44">44</div>			
						<div class="grid-cell" rel="46">46</div>			
						<div class="grid-cell" rel="47">47</div>			
						<div class="grid-cell" rel="47m">47m</div>			
						<div class="grid-cell" rel="48">48</div>			
						<div class="grid-cell" rel="50">50</div>			
						<div class="grid-cell" rel="52">52</div>			
						<div class="grid-cell" rel="53">53</div>			
						<div class="grid-cell" rel="54">54</div>			
						<div class="grid-cell" rel="55">55</div>			
						<div class="grid-cell" rel="56">56</div>			
						<div class="grid-cell" rel="57">57</div>			
						<div class="grid-cell" rel="58">58</div>			
						<div class="grid-cell" rel="59">59</div>			
						<div class="grid-cell" rel="60">60</div>			
						<div class="grid-cell" rel="61">61</div>			
						<div class="grid-cell" rel="62">62</div>			
						<div class="grid-cell" rel="64">64</div>			
						<div class="grid-cell" rel="65">65</div>			
						<div class="grid-cell" rel="66">66</div>			
						<div class="grid-cell" rel="67">67</div>			
						<div class="grid-cell" rel="68">68</div>			
						<div class="grid-cell" rel="70">70</div>			
						<div class="grid-cell" rel="71">71</div>			
						<div class="grid-cell" rel="73">73</div>			
						<div class="grid-cell" rel="75">75</div>			
						<div class="grid-cell" rel="77">77</div>			
						<div class="grid-cell" rel="78">78</div>			
						<div class="grid-cell" rel="79">79</div>			
						<div class="grid-cell" rel="80">80</div>			
						<div class="grid-cell" rel="84">84</div>			
						<div class="grid-cell" rel="88">88</div>			
						<div class="grid-cell" rel="89">89</div>			
						<div class="grid-cell" rel="C">C</div>			
						<div class="grid-cell" rel="G">G</div>			
						<div class="grid-cell" rel="HXH">HXH</div>			
						<div class="grid-cell" rel="J">J</div>			
						<div class="grid-cell" rel="K">K</div>			
						<div class="grid-cell" rel="L">L</div>			
						<div class="grid-cell" rel="R">R</div>			
						<div class="grid-cell" rel="LUCY">LUCY</div>			
						<div class="grid-cell" rel="90">90</div>			
						<div class="grid-cell" rel="91">91</div>			
						<div class="grid-cell" rel="92">92</div>			
						<div class="grid-cell" rel="93">93</div>			
						<div class="grid-cell" rel="94">94</div>			
						<div class="grid-cell" rel="95">95</div>			
						<div class="grid-cell" rel="96">96</div>			
						<div class="grid-cell" rel="97">97</div>			
						<div class="grid-cell" rel="98">98</div>			
						<div class="grid-cell" rel="99">99</div>			
						<div class="grid-cell" rel="103">103</div>			
						<div class="grid-cell" rel="104">104</div>			
						<div class="grid-cell" rel="105">105</div>			
						<div class="grid-cell" rel="106">106</div>			
						<div class="grid-cell" rel="107">107</div>			
						<div class="grid-cell" rel="108">108</div>			
						<div class="grid-cell" rel="109">109</div>			
						<div class="grid-cell" rel="110">110</div>			
						<div class="grid-cell" rel="111">111</div>			
						<div class="grid-cell" rel="112">112</div>			
						<div class="grid-cell" rel="113">113</div>			
						<div class="grid-cell" rel="114">114</div>			
						<div class="grid-cell" rel="115">115</div>			
						<div class="grid-cell" rel="116">116</div>			
						<div class="grid-cell" rel="117">117</div>			
						<div class="grid-cell" rel="118">118</div>			
						<div class="grid-cell" rel="119">119</div>			
						<div class="grid-cell" rel="120">120</div>			
						<div class="grid-cell" rel="123">123</div>			
						<div class="grid-cell" rel="124">124</div>			
						<div class="grid-cell" rel="125">125</div>			
						<div class="grid-cell" rel="126">126</div>			
						<div class="grid-cell" rel="127">127</div>			
						<div class="grid-cell" rel="128">128</div>			
						<div class="grid-cell" rel="129">129</div>			
						<div class="grid-cell" rel="130">130</div>			
						<div class="grid-cell" rel="131">131</div>			
						<div class="grid-cell" rel="132">132</div>			
						<div class="grid-cell" rel="133">133</div>			
						<div class="grid-cell" rel="134">134</div>			
						<div class="grid-cell" rel="139">139</div>			
						<div class="grid-cell" rel="150">150</div>			
						<div class="grid-cell" rel="201">201</div>			
						<div class="grid-cell" rel="204">204</div>			
						<div class="grid-cell" rel="205">205</div>			
						<div class="grid-cell" rel="206">206</div>			
						<div class="grid-cell" rel="310">310</div>
					</div>
					<div class="train">
						<div class="grid-cell" rel="airport">
							Airport
						</div>
						<div class="grid-cell" rel="chestnut-h-east">
							Chestnut Hill East
						</div>
						<div class="grid-cell" rel="chestnut-h-west">
							Chestnut Hill West
						</div>
						<div class="grid-cell" rel="doylestown">
							Doylestown
						</div>
						<div class="grid-cell" rel="elwyn">
							Elwyn
						</div>
						<div class="grid-cell" rel="fox-chase">
							Fox Chase
						</div>
						<div class="grid-cell" rel="malvern">
							Malvern
						</div>
						<div class="grid-cell" rel="marcus-hook">
							Marcus Hook
						</div>
						<div class="grid-cell" rel="norristown">
							Norristown
						</div>
						<div class="grid-cell" rel="paoli">
							Paoli
						</div>
						<div class="grid-cell" rel="temple-u">
							Temple University
						</div>
						<div class="grid-cell" rel="thorndale">
							Thorndale
						</div>
						<div class="grid-cell" rel="trenton">
							Trenton
						</div>
						<div class="grid-cell" rel="warminster">
							Warminster
						</div>
						<div class="grid-cell" rel="west-trenton">
							West Trenton
						</div>
						<div class="grid-cell" rel="wilmington">
							Wilmington
						</div>
					</div>
					<div class="trolley">
						<div class="grid-cell" rel="10">10</div>			
						<div class="grid-cell" rel="11">11</div>			
						<div class="grid-cell" rel="13">13</div>			
						<div class="grid-cell" rel="15">15</div>			
						<div class="grid-cell" rel="34">34</div>			
						<div class="grid-cell" rel="36">36</div>
						<div class="grid-cell" rel="101">101</div>
						<div class="grid-cell" rel="102">102</div>
					</div>
				</div>
			</div>
			<div id="map_canvas">
			</div>
			<br clear="all"/>
		</div>
		<?php include("includes/footer.php"); ?>
	</div>
	<?php include("includes/google-analytics.php"); ?>			
</body>
</html>