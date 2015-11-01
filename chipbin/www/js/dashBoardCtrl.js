startercontrollers.controller('DashCtrl', function ($scope, $rootScope, $http, $filter, $state, InstagramApiUrl,$ionicHistory) {
    // ---------------------------------
    // ---Variable Declaration----------
    // ---------------------------------
    var address;

    var holi = 0; //holding i
    var holj = 0; //holding j
    var mini = 0; //minimum i
    var minj = 0; //minimum j
    var min; //minimum
    var request, request2, request3;

    var p1, p2;

    var x = 0;

    var distance = 0;

    var even;

    var idis = 0;

    var covered = [];

    var latitude;

    var longitude;

    $rootScope.myLatLng = [];

    var a, b, c, d, e, f, g;

    var i = 0;

    var j = 0;

    var k = 0;

    var array, cordi, array1 = [],

        cordi_temp = [];

    var directionsDisplay = new google.maps.DirectionsRenderer({

        suppressMarkers: true

    });

    var directionsService = new google.maps.DirectionsService();

    var directionsDisplay1 = new google.maps.DirectionsRenderer({

        suppressMarkers: true

    });

    var directionsService1 = new google.maps.DirectionsService();

    var addupcs;

    var adfive;

    var icolor;

    var bintran, bintran_temp = [];

    var t = [];

    var next1, next2;

    var mcol;

    var numRoute = 1;

    var cordi2 = [];

    // -------------------------
    // ---Map Display----------
    // -------------------------
    if ($scope.map == null) {

        var mapOptions = {

            zoom: 15,

            center: new google.maps.LatLng(12.9450442, 77.6779853),

            mapTypeId: google.maps.MapTypeId.TERRAIN

        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    }

    // ---------------------------------------------------------
    // ---Create the search box and link it to the UI element---
    // ---------------------------------------------------------
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);

    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // ------------------------------------------
    // ---Geocode to get latlong from place------
    // ------------------------------------------
    var geocoder;

    geocoder = new google.maps.Geocoder();

    $("#clear").on("click", function () {

        location.reload();

    });

    document.getElementById('submit').addEventListener('click', function () {

        geocodeAddress(geocoder, $scope.map);

    });



    // ------------------------------------------
    // ---Function GeocodeAddress----------------
    // ------------------------------------------

    function geocodeAddress(geocoder, resultsMap) {



        address = document.getElementById('pac-input').value;

        geocoder.geocode({

            'address': address

        }, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {

                latitude = results[0].geometry.location.lat();

                longitude = results[0].geometry.location.lng();

                $rootScope.myLatLng = [];

                cordi = [];

                array1 = [];

                array = [];
                //find first 5 characters of the area entered in UI search box  
                address = address.replace(/[^a-zA-Z]/g, "")
                addupcs = address.substr(0, 5);
                adfive = addupcs.toUpperCase();
                // -----------------------------------------------------------------------------------------
                // ---Get all data from Bindetails DB via Ajax & push markers of that area in myLatLng------
                // ----------------------------------------------------------------------------------------
                $http.get(InstagramApiUrl + "/ChipBin/routetran.php?search=" + adfive).success(



                function (response) {


                    //loop to update cordi and mylatlng tables
                    for (var i = 0; i < response.length; i++) {

                        array = [];

                        a, b, c, d, e = 0;

                        array = response[i].split(',');

                        a = array[0];

                        b = Number(array[1]);

                        c = Number(array[2]);

                        d = array[3];

                        e = array[4];

                        //compare binid from db to the area entered in UI search box                                                                                          
                        //fill latlng from db if the bins are in the area of UI searchbox
                        if (adfive == a.substr(0, 5)) {

                            $rootScope.myLatLng.push({

                                BinID: a,

                                lat: b,

                                lng: c,

                                Name: d,

                                BinAddress: e,

                                selected: false

                            });

                            cordi.push({

                                lat: b,

                                lng: c

                            });

                        }

                    }

                    if ($rootScope.myLatLng.length > 1) {

                        //Do futher processing in shortest path function
                        getShortestPath(resultsMap, directionsDisplay, directionsService);

                    }

                }).error(function (data) {

                    alert("Could not connect to DB for BinDetails");

                });;



            } else {

                alert('Geocode was not successful for the following reason: ' + status);

            }

        });

    }

    // ------------------------------------------
    // ---Function getShortestPath---------------
    // ------------------------------------------

    function getShortestPath(resultsMap, directionsDisplay, directionsService) {

        // --------------------------------------------------------------------------------
        // ---Get all data from bintransction DB via Ajax & sort the markers with colors---
        // -------------------------------------------------------------------------------
        $http.get(InstagramApiUrl + "/ChipBin/bintransaction.php?search=" + adfive).success(function (response1) {

            bintran = [];

            //filling bintran array with bintransaction db data
            for (var i = 0; i < response1.length; i++) {

                array = [];

                a, b, c, d, e, f, g = 0;

                array = response1[i].split(',');

                a = array[0];

                b = array[1];

                c = Number(array[2]);

                d = Number(array[3]);

                e = Number(array[4]);

                f = array[5];

                g = Number(array[6]);

                //Decide the color for each marker for all the data
                if (adfive == a.substr(0, 5)) {

                    if (d > 70) {

                        icolor = 'img/REDMARKER.png';

                    } else if ((d <= 70) && (d > 40)) {

                        icolor = 'img/YELLOWMARKER.png';

                    } else if ((d <= 40) && (d >= 0)) {

                        icolor = 'img/GREENMARKER.png';

                    }

                    //push into bintran
                    bintran.push({

                        BinID: a,

                        tdate: b,

                        hum: c,

                        filt: d,

                        temp: e,

                        edate: f,

                        eid: g,

                        icol: icolor

                    });

                };

            };



            //sort the bintran based on BinID and TransactionDate
            bintran.sort(function (a, b) {

                if (a.BinID < b.BinID) return -1;

                if (a.BinID > b.BinID) return 1;

                return 0;

            })

            //Keep only the latest date entry for a binid, delete all the old date entries
            //Deletion of unwanted entries
            i = 0;

            j = 0;

            bintran_temp = [];

            document.getElementById('calc').addEventListener('click', function () {

                decideNumRoute();

            });



            // -------------------------
            // ---Initialize -----------
            // -------------------------
            directionsDisplay = [];

            $scope.markers = [];

            i = 0;

            j = 0;

            covered = [];

            covered.push(mini);

            array = [];

            array1 = [];



            for (i = 0; i < cordi.length; i++) {

                array = [];

                //Pick up the icolor from bintran comparing BinID of Bintran and myLatLng/cordi
                //Since cordi doesn't have binid, using myLatLng as they have same data in same sequense
                array = $filter('filter')(bintran, {

                    BinID: $rootScope.myLatLng[i].BinID

                });

                //update array with lat and long


                if (array.length >= 1) {

                    array1.push({

                        BinID: array[0].BinID,

                        tdate: array[0].tdate,

                        hum: array[0].hum,

                        filt: array[0].filt,

                        temp: array[0].temp,

                        edate: array[0].edate,

                        eid: array[0].eid,

                        icol: array[0].icol,

                        lat: $rootScope.myLatLng[i].lat,

                        lng: $rootScope.myLatLng[i].lng

                    });

                    icolor = array[0].icol;

                }

                // -------------------------
                // ---Markers Display-------
                // -------------------------
                if (array.length > 0) {

                    if ($rootScope.myLatLng[i].BinID == array[0].BinID) {

                        //Push all the markers of that area in UI searchbox
                        $scope.markers.push(new google.maps.Marker({

                            id: $scope.myLatLng[i].BinID,

                            map: $scope.map,

                            position: cordi[i],

                            icon: icolor,

                            title: $rootScope.myLatLng[i].Name,
                            Name: array[0].filt,
                            Address: $scope.myLatLng[i].BinAddress




                        }));



                    }

                }

            };

            for (i = 0; i < $scope.markers.length; i++) {

                marker = $scope.markers[i];

                google.maps.event.addListener(marker, 'click', function () {

                    $scope.selectedBin = [];

                    $scope.selectedBin = [{

                        BinID: this.id,

                        Name: this.title,
                        
                        FillTrend: this.Name

                    }];

                    $scope.Show = false;

                    if (localStorage.getItem('role') === '["Admin"]') {

                        $state.go("main.tabs.binDeatils", {

                            selectedBinsID: $scope.selectedBin

                        });

                    } else {



                        var infowindow = new google.maps.InfoWindow({

                            content: '<b>Name: </b>' + this.title + '</br><b>FillInfo:</b>' + this.Name + '%'+ '</br><b>Address: </b>' + this.Address

                        });



                        infowindow.open($scope.map, this);

                    }

                });

            }



            $scope.map.setCenter(cordi[0]);



            //Now take the decision for how many number of splits have to be done for optimal route

            function decideNumRoute() {

                //Now we need to delete from cordi those bins which are not full(green and yellow)
                //Only red marker bins have to be available for shortest path calculation in cordi array
                i = 0;

                cordi_temp = [];

                while (i < cordi.length) {

                    if ((array1[i].lat == cordi[i].lat) && (array1[i].lng == cordi[i].lng)) {

                        if ((array1[i].icol == "img/GREENMARKER.png") || (array1[i].icol == "img/YELLOWMARKER.png")) {

                            //Do nothing as we don't want these bins for route calculation                         
                        } else {

                            cordi_temp.push({

                                lat: cordi[i].lat,

                                lng: cordi[i].lng

                            });

                        }

                    }



                    i = i + 1;

                }

                cordi = [];

                cordi = cordi_temp;



                //Make disappear the yellow and green markers on the map
                i = 0;

                while (i < $scope.markers.length) {

                    if (($scope.markers[i].icon == "img/GREENMARKER.png") || ($scope.markers[i].icon == "img/YELLOWMARKER.png")) {



                        $scope.markers[i].setMap(null);

                    }



                    i = i + 1;

                }

                numRoute = document.getElementById("mySelect").selectedIndex;

                numRoute = numRoute + 1;

                calcroute();

            };





            function calcroute() {





                distance = 0;

                p1 = 0;

                p2 = 0;

                min = 99999999999999999999999999999999999999999;

                t = [];

                // ------------------------------------------------------------------------------------------------------
                // ---Direction Display with MINIMUM SPANNING TREE ALGORITHM---------------------------------------------
                // ------------------------------------------------------------------------------------------------------
                //Implementing minimum spanning tree algo as starting and ending point are not fixed and can be anything
                //-------------------------------------------------------------------------------------------------------
                //First : Get all the distances between all points and store in temporary array t
                for (i = 0; i < cordi.length; i++) {

                    t[i] = [];

                    for (j = 0; j < cordi.length; j++) {

                        if (i == j) {

                            idis = 99999999999999999999999999999999999999999;

                        } else {

                            p1 = new google.maps.LatLng(cordi[i]["lat"], cordi[i]["lng"]);

                            p2 = new google.maps.LatLng(cordi[j]["lat"], cordi[j]["lng"]);

                            distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);

                            idis = Number(distance);

                        }

                        if (idis < min) {

                            min = idis;

                            holi = i;

                            holj = j;

                        }

                        t[i][j] = idis;



                    }

                }



                //Second : Push the first two points found from above iteration into covered points array
                //and plot the direction between the first two points
                covered = [];

                covered.push(holi);

                covered.push(holj);

                min = 99999999999999999999999999999999999999999;

                request2, request, request3 = 0;

                directionsDisplay = [];

                request2 = {

                    origin: cordi[holi],

                    destination: cordi[holj],

                    travelMode: google.maps.TravelMode.DRIVING

                };

                //added x to fix the bug of below DS getting called second time unwantedly


                directionsService1.route(request2, function (response2, status2) {



                    if (status2 == google.maps.DirectionsStatus.OK) {

                        directionsDisplay1 = new google.maps.DirectionsRenderer({

                            suppressMarkers: true

                        });

                        directionsDisplay1.setDirections(response2);

                        directionsDisplay1.setMap($scope.map);

                    }



                });



                //set x to one as the above direction service shouldn't be called after execution of below loop
                //x = 1;
                t[holi][holj] = 99999999999999999999999999999999999999999;

                t[holj][holi] = 99999999999999999999999999999999999999999;

                i, next1, next2 = 0;

                //for splitting the map into 2    
                if (numRoute == 2) {

                    k = Math.round(cordi.length / 2);

                } else {

                    k = 999999999999999999999999999999999999;

                }

                even = cordi.length % 2;

                if (even == 0) {

                    //Third : Now traverse the array t for finiding minimum points one after the other          
                    //in the matrix t traverse each point to get the shortest path and stored covered points in covered array
                    while (covered.length < cordi.length) {

                        i = i + 1;

                        x = 1;

                        // if ((even == 0) && (numRoute == 2)) {x = 0;}
                        mini = 99999999999999999999999999999999999999999;

                        minj = 99999999999999999999999999999999999999999;

                        for (j = 0; j < cordi.length; j++) {

                            if (covered.indexOf(j) == -1) {

                                if (t[holi][j] < mini) {

                                    mini = t[holi][j];

                                    next1 = j;

                                }

                                if (t[holj][j] < minj) {

                                    minj = t[holj][j];

                                    next2 = j;

                                }

                            }

                        }



                        if (mini < minj) {

                            if (covered.indexOf(next1) == -1) {

                                if (covered.length !== k) {

                                    x = 0;

                                    request3 = {

                                        origin: cordi[holi],

                                        destination: cordi[next1],

                                        travelMode: google.maps.TravelMode.DRIVING

                                    };

                                }

                                if (x == 0) {

                                    directionsService.route(request3, function (response3, status3) {

                                        if (status3 == google.maps.DirectionsStatus.OK) {

                                            directionsDisplay[i] = new google.maps.DirectionsRenderer({

                                                suppressMarkers: true

                                            });



                                            directionsDisplay[i].setDirections(response3);

                                            directionsDisplay[i].setMap($scope.map);

                                        }

                                    });
                                }



                                t[holi][next1] = 99999999999999999999999999999999999999999;

                                t[next1][holi] = 99999999999999999999999999999999999999999;

                                holi = next1;

                                covered.unshift(next1);

                            }





                        } else {

                            if (covered.indexOf(next2) == -1) {

                                if (covered.length !== k) {

                                    x = 0;

                                    request3 = {

                                        origin: cordi[holj],

                                        destination: cordi[next2],

                                        travelMode: google.maps.TravelMode.DRIVING

                                    };

                                }

                                if (x == 0) {

                                    directionsService.route(request3, function (response3, status3) {

                                        if (status3 == google.maps.DirectionsStatus.OK) {

                                            directionsDisplay[i] = new google.maps.DirectionsRenderer({

                                                suppressMarkers: true

                                            });



                                            directionsDisplay[i].setDirections(response3);

                                            directionsDisplay[i].setMap($scope.map);

                                        }

                                    });
                                }



                                t[holj][next2] = 99999999999999999999999999999999999999999;

                                t[next2][holj] = 99999999999999999999999999999999999999999;

                                holj = next2;

                                covered.push(next2);



                            }

                        }



                        //Empty the direction which 
                    }



                }







                //-------------------------------------------------------------------------------  
                // odd
                if (even != 0)

                {

                    //Third : Now traverse the array t for finiding minimum points one after the other          
                    //in the matrix t traverse each point to get the shortest path and stored covered points in covered array
                    while (covered.length < cordi.length) {

                        i = i + 1;

                        mini = 99999999999999999999999999999999999999999;

                        minj = 99999999999999999999999999999999999999999;

                        for (j = 0; j < cordi.length; j++) {

                            if (covered.indexOf(j) == -1) {

                                if (t[holi][j] < mini) {

                                    mini = t[holi][j];

                                    next1 = j;

                                }

                                if (t[holj][j] < minj) {

                                    minj = t[holj][j];

                                    next2 = j;

                                }

                            }

                        }



                        if (mini < minj) {

                            if (covered.indexOf(next1) == -1) {

                                if (covered.length !== k) {

                                    request3 = {

                                        origin: cordi[holi],

                                        destination: cordi[next1],

                                        travelMode: google.maps.TravelMode.DRIVING

                                    };

                                }



                                directionsService.route(request3, function (response3, status3) {

                                    if (status3 == google.maps.DirectionsStatus.OK) {

                                        directionsDisplay[i] = new google.maps.DirectionsRenderer({

                                            suppressMarkers: true

                                        });



                                        directionsDisplay[i].setDirections(response3);

                                        directionsDisplay[i].setMap($scope.map);

                                    }

                                });



                                t[holi][next1] = 99999999999999999999999999999999999999999;

                                t[next1][holi] = 99999999999999999999999999999999999999999;

                                holi = next1;

                                covered.unshift(next1);

                            }





                        } else {

                            if (covered.indexOf(next2) == -1) {

                                if (covered.length !== k) {

                                    request3 = {

                                        origin: cordi[holj],

                                        destination: cordi[next2],

                                        travelMode: google.maps.TravelMode.DRIVING

                                    };

                                }



                                directionsService.route(request3, function (response3, status3) {

                                    if (status3 == google.maps.DirectionsStatus.OK) {

                                        directionsDisplay[i] = new google.maps.DirectionsRenderer({

                                            suppressMarkers: true

                                        });





                                        directionsDisplay[i].setDirections(response3);

                                        directionsDisplay[i].setMap($scope.map);

                                    }

                                });



                                t[holj][next2] = 99999999999999999999999999999999999999999;

                                t[next2][holj] = 99999999999999999999999999999999999999999;

                                holj = next2;

                                covered.push(next2);



                            }

                        }



                        //Empty the direction which 
                    }

                }

                //-------------------------------------------------------------------------------                 
            };









        }).error(function (data) {

            alert("Could not connect to DB for BinTransaction");

        });;







    }



})