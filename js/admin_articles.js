var viewModel = {
    info: ko.observableArray([]),
    authorID: ko.observable(null),
    authorFullName: ko.observable(null),
    selectedArticle: ko.observable(null),
    page: ko.observable(1),
    totalPages: ko.observable(0),
    pagesNumber: ko.pureComputed(function () {
        var pages = [];

        for (var i = 1; i <= viewModel.totalPages(); i++) {
            pages.push(i);
        }

        return pages;
    }),
    checkID: function () {
        viewModel.authorID(prompt("Введіть ID автора:"));
    },
    getInfo: function () {
        $.getJSON("/api/users/" + viewModel.authorID() + "/articles/" + viewModel.page() + "/3")
            .done(function (object) {
                viewModel.totalPages(object.totalPages);
                viewModel.info(object.data);
                viewModel.authorFullName(object.data[0].authorFullName);
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
    editArticle: function (article) {
        $.getJSON("/api/users/" + viewModel.authorID() + "/articles/" + article.id)
            .done(function (article) {
                viewModel.selectedArticle(new Article(article));
            });
    },
    removeArticle: function (article) {
        viewModel.selectedArticle(new Article(article));

        $.ajax({
            url: "/api/users/"+ viewModel.authorID() + "/articles/" + viewModel.selectedArticle().id(),
            type: "delete"
        }).done(function () {
            viewModel.getInfo();
            viewModel.selectedArticle(null);
        });
    },
    addNewArticle: function () {
        viewModel.selectedArticle(new Article({
            authorFullName: viewModel.authorFullName(),
            thumbnail: "https://placehold.it/960x540"
        }));
    },
    saveArticle: function () {
        var type = viewModel.selectedArticle().id() ? "put" : "post";

        $.ajax({
            url: "/api/users/" + viewModel.authorID() + "/articles",
            type: type,
            data: ko.toJSON(viewModel.selectedArticle()),
            contentType: "application/json"
        }).done(function () {
            viewModel.getInfo();
            viewModel.selectedArticle(null);
        });
    },
    cancelAction: function () {
        viewModel.selectedArticle(null);
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
            viewModel.selectedArticle().thumbnail(dataURI);
        };
    }
};

ko.applyBindings(viewModel);

viewModel.checkID();
viewModel.getInfo();
viewModel.selectedArticle.subscribe(function (user) {
   if(user) {
       tinymce.init({ selector:'textarea' });
   }
});

function Article(json) {
    this.id = ko.observable(json.id);
    this.title = ko.observable(json.title);
    this.authorID = ko.observable(json.authorID);
    this.authorFullName = ko.observable(json.authorFullName);
    this.content = ko.observable(json.content);
    this.shortContent = ko.observable(json.shortContent);
    this.thumbnail = ko.observable(json.thumbnail);
}
