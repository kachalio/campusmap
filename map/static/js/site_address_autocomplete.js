//Get your Azure Maps key at https://azure.com/maps
var subscriptionKey = 'SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c';

var geocodeServiceUrlTemplate = 'https://atlas.microsoft.com/search/address/json?typeahead=true&subscription-key={subscription-key}&api-version=1&query={query}&language={language}&view=Auto';

function PageLoaded() {

    $("#id_streetAddress").autocomplete({
        minLength: 3,   //Don't ask for suggestions until atleast 3 characters have been typed. This will reduce costs by not making requests that will likely not have much relevance.
        source: function (request, response) {
            // var center = map.getCamera().center;

            // var elm = document.getElementById('countrySelector');
            // var countryIso = elm.options[elm.selectedIndex].value;

            //Create a URL to the Azure Maps search service to perform the search.
            var requestUrl = geocodeServiceUrlTemplate.replace('{query}', encodeURIComponent(request.term))
                .replace('{searchType}', document.querySelector('input[name="streetAddress"]').value)
                .replace('{subscription-key}', subscriptionKey)
                .replace('{language}', 'en-US')

            console.log(requestUrl);

            $.ajax({
                url: requestUrl,
                success: function (data) {
                    response(data.results);
                }
            });
        },
        select: function (event, ui) {
            console.log(ui.item.address.freeformAddress);

            $('#id_streetAddress').val(ui.item.address.freeformAddress);
            return false
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        //Format the displayed suggestion to show the formatted suggestion string.
        var suggestionLabel = item.address.freeformAddress;

        if (item.poi && item.poi.name) {
            suggestionLabel = item.poi.name + ' (' + suggestionLabel + ')';
        }

        return $("<li>")
            .append("<a>" + suggestionLabel + "</a>")
            .appendTo(ul);
        }
}

$(document).ready(function () {
    PageLoaded();
});