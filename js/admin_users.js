var viewModel = {
    info: ko.observableArray([]),
    selectedUser: ko.observable(null),
    page: ko.observable(1),
    pagesNumber: ko.pureComputed(function () {
        var pages = [];

        for (var i = 1; i <= viewModel.totalPages(); i++) {
            pages.push(i);
        }

        return pages;
    }),
    totalPages: ko.observable(0),
    countries: ko.observableArray([]),
    forRemove: ko.pureComputed(function () {
        return viewModel.selectedUser() && viewModel.selectedUser().id();
    }),
    getInfo: function () {
        $.getJSON("/api/users/" + viewModel.page() + "/10/preview")
            .done(function (object) {
                viewModel.totalPages(object.totalPages);
                viewModel.info(object.data);
            });
    },
    getCountries: function () {
        $.getJSON("/api/countries/")
            .done(function (object) {
                viewModel.countries(object);
            });
    },
    selectUser: function (user) {
        $.getJSON("/api/users/" + user.id)
            .done(function (user) {
                viewModel.selectedUser(new User(user));
            });
    },
    goToPage: function (number) {
        viewModel.page(number);
        viewModel.getInfo();
    },
    goToPrevPage: function () {
        if (viewModel.page() <= 1) {
            return;
        }

        viewModel.goToPage(viewModel.page() - 1);
    },
    goToNextPage: function () {
        if (viewModel.page() >= viewModel.totalPages()) {
            return;
        }

        viewModel.goToPage(viewModel.page() + 1);
    },
    saveUser: function () {
        var type = viewModel.selectedUser().id() ? "put" : "post";

        $.ajax({
            url: "/api/users",
            type: type,
            data: ko.toJSON(viewModel.selectedUser()),
            contentType: "application/json"
        }).done(function (data) {
            viewModel.getInfo();
            viewModel.selectUser(data);
        });
    },
    removeUser: function () {
        $.ajax({
            url: "/api/users/" + viewModel.selectedUser().id(),
            type: "delete"
        }).done(function () {
            viewModel.getInfo();
            viewModel.selectedUser(null);
        });
    },
    addUser: function () {
        viewModel.selectedUser(new User({
            photo: "https://placehold.it/960x540"
        }));
    },
    cancel: function () {
        viewModel.selectedUser(null);
    },
    openFileDialog: function () {
        document.getElementById("openFileDialogElement").click();
    },
    uploadImage: function (context, e) {
        var files = e.target.files;

        if (!files.length) {
            return;
        }

        var ourImage = files[0];

        var fileReader = new FileReader();
        fileReader.readAsDataURL(ourImage);
        fileReader.onloadend = function () {
            var dataURI = fileReader.result;
            viewModel.selectedUser().photo(dataURI);
        };
    }
};

ko.applyBindings(viewModel);

viewModel.getInfo();
viewModel.getCountries();
viewModel.selectedUser.subscribe(function(newUser) {
    if (newUser) {
        $('#birthday').datetimepicker().data('DateTimePicker').date(new Date(newUser.birthday()));
    }
});
viewModel.selectedUser.subscribe(function(newUser) {
    if (newUser) {
        $("#id").bootstrapSwitch({
            onSwitchChange: function(event, state) {
                if (state) {
                    document.getElementById("infoID").style.display = "block";
                } else {
                    document.getElementById("infoID").style.display = "none";
                }
            }
        });
    }
});

function User(json) {
    this.id = ko.observable(json.id);
    this.fullName = ko.observable(json.fullName);
    this.birthday = ko.observable(json.birthday);
    this.profession = ko.observable(json.profession);
    this.email = ko.observable(json.email);
    this.address = ko.observable(json.address);
    this.country = ko.observable(json.country);
    this.shortInfo = ko.observable(json.shortInfo);
    this.fullInfo = ko.observable(json.fullInfo);
    this.photo = ko.observable(json.photo);
}