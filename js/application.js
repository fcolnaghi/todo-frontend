var app = angular.module("todo", [ 'restangular' ]);

app.factory('Todo', ["Restangular", function(Restangular) {
			var backendUrl = "http://localhost:8888/services";

			Restangular.setBaseUrl(backendUrl);

			var service = {
				// our factory definition
				todo : {
					title : "",
					description : "",
					email: ""
				},

				setTitle : function(title) {
					service.todo['title'] = title;
				},

				setDescription : function(description) {
					service.todo['description'] = description;
				},

				save : function() {
					Restangular.one("todo").post("create", service.todo).then(function(resp) {
						this.list(service.todo.email, function(data) {
							$scope.todolist = data;
						});					
					}, function(resp) {
						console.log("erro ao executar o post", resp);
					});
				},

				list : function(getEmail, callback) {
					Restangular.one("todo").customGET("list", {profile: getEmail}).then(function(response) {
						callback(response);
					}, function(response) {
						console.log("erro ao obter lista: " + getEmail);
					});
				}
			};

			return service;
		} ]);

app.controller("TodoController", function($scope, Todo) {

	/* lista as tarefas relacionadas ao email informado */
	$scope.listar = function() {
		Todo.list($scope.todo.email, function(data) {
			$scope.todolist = data;
		});
	};

	/* valida o formulário para inclusão de novo todo */
	$scope.salvar = function() {
		Todo.todo = angular.copy($scope.todo);
		Todo.save();
	};

})
