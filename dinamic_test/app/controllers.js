'use strict';

app.controller('ExaminationCtrl',  ['$scope','$http',function($scope, $http) {
    $scope.student = {};
    $scope.action='show';


    $scope.create = function (action) {

        $scope.student;

        if ($scope.student.subject == "Ֆիզիկա")  {    // select-ի մեջ եղած հայերեն անվանումները համեմատում ենք, բազաների անունների հետ
            $scope.student.subject = "fizika";
        }
        if ($scope.student.subject == "Մաթեմատիկա")  {
            $scope.student.subject = "matematica";
        }
        if ($scope.student.subject == "Ինֆորմատիկա")  {
            $scope.student.subject = "informatica";
        }


        var url = "http://localhost:8081/student";
        $http.post(url, $scope.student)  // ուղարկում ուսանողի ընտրած ենք առարկան
            .then(function(res) {

                 $scope.errors = res.data;
                
                 if (typeof(res.data) == "string") {
                     $scope.action=action;

                      
                     /**
                      *   Databases
                      * */

                     var level;
                     var x = 1;

                     $scope.count = 0;

                     $http.get("http://localhost:8081/test_" + x)   // թեստերի մակարդակների ստուգում
                         .then(function(res) {
                             $scope.test = res.data;
                             level = $scope.test[Math.floor(Math.random() * $scope.test.length)];

                             $scope.harc =  level.harc;
                             $scope.tarberakner =  level.tarberakner;
                             $scope.patasxan =  level.patasxan;
                         });

                     $scope.sendAnswer =  function() {
                         if ($scope.selectedAnswer == $scope.patasxan) {
                             $scope.count+=level.point;
                             

                             if (x != 3) {
                                 x+=1; // թեստի մակարդակը բարձրանում է
                                 $http.get('http://localhost:8081/test_' + x)  
                                     .then(function(res) {
                                         $scope.test = res.data;
                                         level = $scope.test[Math.floor(Math.random() * $scope.test.length)];
                                         $scope.harc =  level.harc;
                                         $scope.tarberakner =  level.tarberakner;
                                         $scope.patasxan =  level.patasxan;

                                     })
                             }

                             else {
                                 $http.get('http://localhost:8081/test_' + 3)  // եթե վերջին 3-րդ մակարդակում է, այլևս չբարձրանա մակարդակը,,
                                                                                // ճիշտ պատասխաններն ավարտելու դեպքում, ավարվի նաև թեստը
                                     .then(function(res) {

                                         $scope.test = res.data;
                                         level = $scope.test[Math.floor(Math.random() * $scope.test.length)];

                                         $scope.harc =  level.harc;
                                         $scope.tarberakner =  level.tarberakner;
                                         $scope.patasxan =  level.patasxan;

                                     });
                             }


                         } else {
                             if(x!=1){
                                 x-=1; // թեստի մակարդակը նվազում է
                                 $http.get('http://localhost:8081/test_' + x)
                                     .then(function(res) {

                                         $scope.test = res.data;
                                         level = $scope.test[Math.floor(Math.random() * $scope.test.length)];
                                         
                                         $scope.harc =  level.harc;
                                         $scope.tarberakner =  level.tarberakner;
                                         $scope.patasxan =  level.patasxan;

                                     });
                             }
                             else {
                                 $http.get('http://localhost:8081/test_' + 1) // եթե 1-ին մակարդակում է, սխալ պատասխանի դեպքում չնվազի մակարդակը,,
                                                                                
                                     .then(function(res) {

                                         $scope.test = res.data;
                                         level = $scope.test[Math.floor(Math.random() * $scope.test.length)];

                                         $scope.harc =  level.harc;
                                         $scope.tarberakner =  level.tarberakner;
                                         $scope.patasxan =  level.patasxan;

                                     });
                             }
                         }
                     }

                     $scope.sendData=function () {
                         $scope.student.count=$scope.count;
                         
                         var uploadUrl = "http://127.0.0.1:8081/account";
                         $http.post(uploadUrl, $scope.student) .then(function(res) {
                             
                             $scope.result =  res.data.resultat;
                         });
                     }



                 } else {

                     $scope.formStudents = false;
                     
                 }
            });


 };



}]);


app.controller('UsersCtrl',  ['$scope','$http',function($scope, $http) {

         $http.get('http://localhost:8081/subjectFizica')
         .then(function(res) {
         $scope.fizica = res.data;


            })
    $http.get('http://localhost:8081/subjectInformatica')
         .then(function(res) {
         $scope.informatica = res.data;


            })
    $http.get('http://localhost:8081/subjaectMatematica')
         .then(function(res) {
         $scope.matematica= res.data;


            })


}]);

app.controller('InformaticsCtrl',  ['$scope','$http',function($scope, $http) {
$scope.insert=function () {

    var t1=$scope.obj.obj1.tarberakner; // 1-ին մակարդակի հարցերի տարբերակներ
    var tarberakner1 =t1.split("+");
    $scope.obj.obj1.tarberakner = tarberakner1;

    var t2=$scope.obj.obj2.tarberakner; // 2-րդ մակարդակի հարցերի տարբերակներ
    var tarberakner2 =t2.split("+");
    $scope.obj.obj2.tarberakner = tarberakner2;

    var t3=$scope.obj.obj3.tarberakner;   // 3-րդ մակարդակի հարցերի տարբերակներ
    var tarberakner3 =t3.split("+");
    $scope.obj.obj3.tarberakner = tarberakner3;


 $http.post('http://localhost:8081/info_questions', $scope.obj) .then(function(res) {
        var result = res.data;
 });


}

}]);
