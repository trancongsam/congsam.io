(function () {
    angular.module('app.components.setting')
        .controller('SettingController', SettingController);

    SettingController.$inject = ['$state', '$localStorage', 'messageShow', '$timeout', '$timeout'];
    function SettingController($state, $localStorage, messageShow, $timeout) {

        var vm = this;
        vm.connected1 = false;
        vm.wait1 = false;
        //vm.connected2 = false;
        //vm.wait2 = false;
        vm.listType = [];
        var topicPublish1 = "control1";
        //var topicPublish2 = "control2";
        // var client = new Paho.MQTT.Client("host", port, "client_id");
        var client = new Paho.MQTT.Client("m20.cloudmqtt.com", 32733, "web_" + parseInt(Math.random() * 100, 10));
         //var client2 = new Paho.MQTT.Client("m20.cloudmqtt.com", 32666, "web_" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
       // client2.onConnectionLost = onConnectionLost2;
       // client2.onMessageArrived = onMessageArrived2;
        vm.zone1Default = [
            {
                type: "Xà Lách",
                highTemp: 25,
                lowTemp: 15,
                highHud: 80,
                lowHud: 70
            },
            {
                type: "Bó Xôi",
                highTemp: 20,
                lowTemp: 15,
                highHud: 80,
                lowHud: 70
            },
            {
                type: "Cải Bắp",
                highTemp: 20,
                lowTemp: 18,
                highHud: 85,
                lowHud: 75
            }
        ]
      
        if (!$localStorage.zone1) {
            $localStorage.zone1 = vm.zone1Default;
        }
        
        vm.zone1 = angular.copy($localStorage.zone1);
       
        vm.item1 = vm.zone1[0];
       
        vm.send = send;
        var options = {
            useSSL: true,
            userName: "ctcjmuyy",
            password: "NFFKErc6QcQt",
            onSuccess: onConnect,
            onFailure: doFail
        }
        
        vm.zone1Change = zone1Change;
        
        // connect the client
        client.connect(options);
       
        vm.index1 = 0;
       
        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            client.subscribe("event1");
            $timeout(function () {
                vm.connected1 = true;
                vm.wait1 = false;
            });
        }

        

        function doFail(e) {
            console.log(e);
        }
        

        function sendMessage(destination, message) {
            var message = new Paho.MQTT.Message(message);
            message.destinationName = destination;
            client.send(message);
        }

        
        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }
       

        // called when a message arrives
        function onMessageArrived(message) {
            console.log("onMessageArrived:" + message.payloadString);
            if (message.destinationName == "event1") {
                var data = message.payloadString;
                vm.connected1 = true;
                vm.wait1 = false;
                console.log(message.destinationName);
            }
        }

       
        function send(id) {
            if (id == 1) {
                vm.zone1[vm.index1] = vm.item1;
                $localStorage.zone1 = vm.zone1;
                var item = angular.copy(vm.item1);
                delete item.type;
                var msg = JSON.stringify(item);
                sendMessage(topicPublish1, msg)
            } 

        function zone1Change(item) {
            $timeout(function () {
                vm.item1 = item;
                var index = _.findIndex(vm.zone1, vm.item1)
                vm.index1 = index;
            })
        }
       
    }
})();
