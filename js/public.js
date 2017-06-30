var viewModel = {
    info: ko.observableArray([]),
    page: ko.observable(1),
    totalPages: ko.observable(0),
    pagesNumber: ko.pureComputed(function () {
        var pages = [];

        for (var i = 1; i <= viewModel.totalPages(); i++) {
            pages.push(i);
        }

        return pages;
    }),
    getInfo: function () {
        $.getJSON("/api/articles/" + viewModel.page() + "/5")
            .done(function (object) {
                viewModel.totalPages(object.totalPages);
                viewModel.info(object.data);
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
    }
};

ko.applyBindings(viewModel);

viewModel.getInfo();
