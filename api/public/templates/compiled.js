(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h1 id=\"main-header\">Welcome to felice</h1>\r\n<button id=\"login-button\" class=\"btn btn-primary\">Login with Spotify</button>";
},"useData":true});
templates['sidebar'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"bs-sidebar affix\">\r\n    <ul class=\"nav bs-sidenav\">\r\n        <li class=\"active\">\r\n            <ul class=\"nav\">\r\n                <li>\r\n                    <div id=\"sidebar-logo\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:osb=\"http://www.openswatchbook.org/uri/2009/osb\"\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg2\"\r\n                           viewBox=\"0 0 192 192\">\r\n                          <defs\r\n                             id=\"defs4\">\r\n                            <linearGradient\r\n                               osb:paint=\"solid\"\r\n                               id=\"linearGradient4146\">\r\n                              <stop\r\n                                 id=\"stop4148\"\r\n                                 offset=\"0\"\r\n                                 style=\"stop-color:#000000;stop-opacity:1;\" />\r\n                            </linearGradient>\r\n                          </defs>\r\n                          <metadata\r\n                             id=\"metadata7\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\">\r\n                            <path\r\n                               id=\"path4158\"\r\n                               d=\"M 95.74441,860.18737 A 96.32192,95.858052 0 0 0 -0.57498956,956.04663 96.32192,95.858052 0 0 0 53.243291,1041.938 c 26.414452,-2.193 35.984042,-43.71486 34.345317,-66.73892 -0.09019,-1.26729 -0.150173,-2.50808 -0.211236,-3.75289 -6.92077,4.13038 -12.158563,11.23049 -17.926299,14.3105 l 4.998028,-16.44212 c 2.39623,0.14182 4.978493,-1.14964 7.507778,-2.09206 1.707771,-0.63664 3.479155,-1.66237 5.184198,-2.27547 l 0.03221,-0.0184 c -0.527841,-51.30579 22.946756,-81.87616 25.358896,-84.51444 5.49359,-6.00865 9.3755,-9.11367 18.46691,-6.66813 5.53418,1.48865 15.51755,14.58322 4.06,18.82175 -7.77655,2.87684 -14.63021,-1.672 -19.07197,-4.82766 -17.952929,26.94329 -17.394381,46.98977 -16.390375,70.62102 6.411485,-2.93285 12.888105,-6.42154 19.136425,-7.95863 l -3.12198,10.10107 c -5.68847,0.5614 -10.34791,3.52353 -15.652844,5.95279 0.620344,12.53903 1.917634,28.64117 -1.514446,42.51779 -4.20758,17.0124 -14.314392,34.2873 -32.669757,38.1037 a 96.32192,95.858052 0 0 0 29.970258,4.8277 96.32192,95.858052 0 0 0 96.322979,-95.8594 96.32192,95.858052 0 0 0 -96.322979,-95.85924 z\"\r\n                               style=\"fill:#e6e6e6;stroke:none;stroke-opacity:1\" />\r\n                          </g>\r\n                        </svg>\r\n\r\n                    </div>\r\n                </li>\r\n\r\n                <li>\r\n                    <div class=\"sidebar-containers\" id=\"song-list\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg4136\"\r\n                           viewBox=\"0 0 192 192\"\r\n                           class=\"svg-icon\">\r\n                          <defs\r\n                             id=\"defs4138\" />\r\n                          <metadata\r\n                             id=\"metadata4141\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\" />\r\n                          <g\r\n                             id=\"layer2\">\r\n                            <path\r\n                               transform=\"matrix(1.1764192,0,0,1.0752327,-27.131273,-3.224908)\"\r\n                               d=\"M 43.564355,162.29703 42.948727,24.038598 162.99185,92.634664 Z\"\r\n                               id=\"path8014\"\r\n                               style=\"fill:#88888f;fill-opacity:1;stroke:#88888f;stroke-width:5;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                          </g>\r\n                        </svg> \r\n                    </div>\r\n                </li>\r\n\r\n                <li>\r\n                    <div class=\"sidebar-containers\" id=\"profile\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg4136\"\r\n                           viewBox=\"0 0 192 192\"\r\n                           class=\"svg-icon\">\r\n                          <defs\r\n                             id=\"defs4138\" />\r\n                          <metadata\r\n                             id=\"metadata4141\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\">\r\n                            <rect\r\n                               y=\"874.49249\"\r\n                               x=\"8.0415173\"\r\n                               height=\"124.47996\"\r\n                               width=\"175.61682\"\r\n                               id=\"rect4751\"\r\n                               style=\"fill:none;fill-opacity:1;stroke:#88888f;stroke-width:8.64334774;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                            <path\r\n                               id=\"path4699-3\"\r\n                               d=\"m 56.959247,1044.0874 77.458313,0 c -0.28068,-33.7177 0.13402,-79.92327 -38.729154,-79.91705 -38.620954,0.0132 -38.237936,45.76035 -38.729159,79.91705 z\"\r\n                               style=\"fill:#88888f;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:0.17159765\" />\r\n                          </g>\r\n                          <g\r\n                             id=\"layer2\">\r\n                            <ellipse\r\n                               ry=\"21.246281\"\r\n                               rx=\"20.437735\"\r\n                               cy=\"67.827507\"\r\n                               cx=\"95.443459\"\r\n                               id=\"path4697\"\r\n                               style=\"fill:#88888f;fill-opacity:0.9881657;stroke:none;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                          </g>\r\n                        </svg> \r\n                    </div>\r\n                </li>\r\n\r\n                <li>\r\n                    <div class=\"sidebar-containers\" id=\"pie\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg4136\"\r\n                           viewBox=\"0 0 192 192\"\r\n                            class=\"svg-icon\">\r\n                          <defs\r\n                             id=\"defs4138\" />\r\n                          <metadata\r\n                             id=\"metadata4141\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\" />\r\n                          <g\r\n                             id=\"layer2\">\r\n                            <path\r\n                               id=\"path7980\"\r\n                               d=\"M 91.692466,3.7698685 A 93.332828,92.863868 0 0 0 3.1770773,96.463417 93.332828,92.863868 0 0 0 96.509732,189.32847 93.332828,92.863868 0 0 0 166.90443,157.26532 L 92.291519,98.347323 91.950978,98.496761 91.692466,3.7698685 Z\"\r\n                               style=\"fill:#88888f;fill-opacity:1;stroke:none;stroke-width:7;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.17159765\" />\r\n                            <path\r\n                               id=\"path8001\"\r\n                               d=\"M 99.68786,3.7962616 99.33464,91.204956 178.08913,53.327461 C 155.11396,17.961332 129.8332,5.0334076 99.68786,3.7962616 Z\"\r\n                               style=\"fill:#88888f;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\" />\r\n                            <path\r\n                               id=\"path8006\"\r\n                               d=\"M 102.79982,97.103909 179.97924,60.4683 c 13.86838,28.470502 9.15664,74.48557 -9.13553,88.79478 z\"\r\n                               style=\"fill:#88888f;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\" />\r\n                          </g>\r\n                        </svg> \r\n                    </div>\r\n                </li>\r\n\r\n                <li>\r\n                    <div class=\"sidebar-containers\" id=\"line\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg4136\"\r\n                           viewBox=\"0 0 192 192\"\r\n                           class=\"svg-icon\">\r\n                          <defs\r\n                             id=\"defs4138\" />\r\n                          <metadata\r\n                             id=\"metadata4141\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\" />\r\n                          <g\r\n                             id=\"layer2\">\r\n                            <path\r\n                               id=\"path8008\"\r\n                               d=\"m 6.6691345,15.183178 0.08234,156.895562 179.6393855,0\"\r\n                               style=\"fill:none;fill-rule:evenodd;stroke:#88888f;stroke-width:5.97020674;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                            <path\r\n                               id=\"path8010\"\r\n                               d=\"M 12.346467,172.85937 37.523885,79.963951 66.198167,140.85339 93.47371,44.835434 129.14172,149.44035 148.72415,93.234729 148.02479,94.796\"\r\n                               style=\"fill:none;fill-rule:evenodd;stroke:#88888f;stroke-width:7.46275854;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                            <path\r\n                               transform=\"matrix(1.4081978,-0.1262506,0.11310839,1.571818,-51.128875,-39.58388)\"\r\n                               d=\"m 140.09901,96.455441 -11.0853,-5.481088 10.28941,-6.859607 z\"\r\n                               id=\"path8012\"\r\n                               style=\"fill:#888888;fill-opacity:0.99408288;stroke:#88888f;stroke-width:5;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                          </g>\r\n                        </svg> \r\n\r\n                    </div>\r\n                </li>\r\n\r\n                <li>\r\n                    <div class=\"sidebar-containers\" id=\"add-friend\">\r\n                        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n                        <svg\r\n                           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n                           xmlns:cc=\"http://creativecommons.org/ns#\"\r\n                           xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n                           xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n                           xmlns=\"http://www.w3.org/2000/svg\"\r\n                           version=\"1.1\"\r\n                           id=\"svg4136\"\r\n                           viewBox=\"0 0 192 192\"\r\n                           class=\"svg-icon\">\r\n                          <defs\r\n                             id=\"defs4138\" />\r\n                          <metadata\r\n                             id=\"metadata4141\">\r\n                            <rdf:RDF>\r\n                              <cc:Work\r\n                                 rdf:about=\"\">\r\n                                <dc:format>image/svg+xml</dc:format>\r\n                                <dc:type\r\n                                   rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\r\n                                <dc:title></dc:title>\r\n                              </cc:Work>\r\n                            </rdf:RDF>\r\n                          </metadata>\r\n                          <g\r\n                             transform=\"translate(0,-860.36216)\"\r\n                             id=\"layer1\">\r\n                            <rect\r\n                               y=\"923.47015\"\r\n                               x=\"13.980201\"\r\n                               height=\"17.6644\"\r\n                               width=\"65.576736\"\r\n                               id=\"rect7459\"\r\n                               style=\"fill:#88888f;fill-opacity:1;stroke:none;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.99408288\" />\r\n                            <rect\r\n                               transform=\"matrix(-0.01645461,-0.99986461,0.99985137,-0.01724039,0,0)\"\r\n                               y=\"22.786976\"\r\n                               x=\"-964.80103\"\r\n                               height=\"17.257153\"\r\n                               width=\"67.12429\"\r\n                               id=\"rect7459-5\"\r\n                               style=\"fill:#88888f;fill-opacity:1;stroke:none;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.99408288\" />\r\n                          </g>\r\n                          <g\r\n                             id=\"layer2\">\r\n                            <ellipse\r\n                               ry=\"28.610497\"\r\n                               rx=\"27.593294\"\r\n                               cy=\"33.462826\"\r\n                               cx=\"130.44864\"\r\n                               id=\"path4697\"\r\n                               style=\"fill:#88888f;fill-opacity:0.9881657;stroke:none;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" />\r\n                            <path\r\n                               id=\"path4699\"\r\n                               d=\"m 82.79141,187.23198 96.10326,0.0981 C 178.82077,142.55017 180.24682,80.246107 131.13277,80.255224 82.955892,80.26457 83.149555,140.29953 82.79141,187.23198 Z\"\r\n                               style=\"fill:#88888f;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:0.17159765\" />\r\n                          </g>\r\n                        </svg> \r\n\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n        </li>\r\n    </ul>\r\n</div>";
},"useData":true});
templates['songlist'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<li>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? depth0.artist : depth0), depth0))
    + " <a href=\"https://open.spotify.com/track/"
    + alias2(alias1((depth0 != null ? depth0.trackId : depth0), depth0))
    + "\" target=\"_blank\">CLICK TO PLAY</a> "
    + alias2(alias1((depth0 != null ? depth0.duration_ms : depth0), depth0))
    + " </li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h1 id=\"main-header\">Library</h1>\r\n<ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.songList : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
})();
