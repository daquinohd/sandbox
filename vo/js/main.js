;(function($, doc, win) {
	$.noConflict();

	$(doc).ready(function() {

		// enable dropdowns
		$('.js-dropdown').dropdown();

		// equalize on home page only
		/*
		if (window.location.pathname == '/') {
			new Equalizer($('.js-equalizer'));
		}
		*/
        
        if(typeof(NCIAnalytics) !== 'undefined') 
        {
            triggerAnalytics($);
        }

	});
}(jQuery, document, window));


/**
 * 
 * @param {function} $ 
 */
function triggerAnalytics($) {
    // TODO: clean up 
    console.log('NCIAnalytics object found...');

    // Query parameters
    var pathName = window.location.pathname.toLowerCase();
    var imageID = getParameterByName('imageid') || '';
    var imageIDs = getParameterByName('imageids') || '';
    var groupID = getParameterByName('groupid') || '';
    var topicID = getParameterByName('topicid') || '';
    var searchTerm = getParameterByName('q') || '';
    
    //// CGOV-4453
    // Track image detail button clicks
    var $detail = 'vol_detail|' + imageID + '|';		
    $('a.add-picture').click(function() {
        NCIAnalytics.DetailsActionClick($(this), $detail + 'na|favorite');
    })
    $('.view a').click(function() {
        var $id = $(this).attr('id').split('-');
        NCIAnalytics.DetailsActionClick($(this), $detail + $id[1] + '|view');
    })
    $('.download a').click(function() {
        var $id = $(this).attr('id').split('-');
        NCIAnalytics.DetailsActionClick($(this), $detail + $id[1] + '|download');
    })


    //// CGOV-4455
    // Set utility link vars
    var $galleryType = 'vol_gallery|';
    if(topicID.length > 0 || searchTerm.length > 0) {
        $galleryType += 'search|';
    }
    else if(groupID.length > 0) {
        $galleryType += 'collection|';
    }
    else if(pathName.indexOf('lightbox.cfm') > -1) {
        $galleryType += 'mypictures|';
    }
    // Track utility links
    $('.plus-magnify-icon').click(function() {
        NCIAnalytics.UtilityLinkClick($(this), $galleryType + 'zoomin');
    })
    $('.minus-magnify-icon').click(function() {
        NCIAnalytics.UtilityLinkClick($(this), $galleryType + 'zoomout');
    })
    $('.gallery-icon a').click(function() {
        NCIAnalytics.UtilityLinkClick($(this), $galleryType + 'slideshow');
    })


    //// CGOV-4456
    // Track 'My pictures' download/linkto links
    // /lightbox.cfm?imageids=0%2C2588%2C2234%2C8069%2C1935
    if(pathName.indexOf('lightbox.cfm') > -1) {
        // Track detail page clicks
        $('#link-to-set').click(function() {
            NCIAnalytics.FavoritesActionClick($(this), 'vol_favorites|linkto');
        })
        $('#download-zip').click(function() {
            NCIAnalytics.FavoritesActionClick($(this), 'vol_favorites|download');
        })
    }


    //// CGOV-4509
    // Track homepage card clicks
    $(".cards div[id^='card-']").click(function() {
        var $this = $(this);
        var $title = $this.text().trim();
        var $type = 'vol_card:' + $this.attr('id').replace('card-','');
        console.log('prop57: ' + $title);
        console.log('prop58: ' + $title);
        console.log('prop59: ' + $type);
        console.log('prop67:  D=pageName');
        // NCIAnalytics.HomepageCardClick($this, $title, $type);
    })


    //// CGOV-5058
    // Global Search
    $('.searchform').submit(function() {
        var $this = $(this);
        var $term = $this.serialize();
        console.log('prop11/eVar11: ' + 'vol_globalsearch');
        console.log('prop14/eVar14: ' + $term.replace('q=',''));
        // NCIAnalytics.SearchOptions($(this), $term, 'vol_globalsearch');
    })

    // Advanced Search
    $('.content-form#search').submit(function() {
        var $this = $(this);
        var $term = $this.serialize();
        console.log('prop11/eVar11: ' + 'vol_advancedsearch');
        console.log('prop14/eVar14: ' + $term);
        // NCIAnalytics.SearchOptions($(this), $term, 'vol_advancedsearch');
    })

    // Modify Search
    $('#againform').submit(function() {
        var $this = $(this);
        var $term = $this.serialize();
        console.log('prop11/eVar11: ' + 'vol_modifysearch');
        console.log('prop14/eVar14: ' + $term);
        // NCIAnalytics.SearchOptions($(this), $term, 'vol_modifysearch');
    }) 

    // Track search dropdown and more search options
    if(pathName.indexOf('search.cfm') == -1 && pathName.indexOf('searchaction.cfm') == -1) {
        $('#topicid').change(function() {    
            var $this = $(this);
            var $term = $this.find('option:selected').text();
            $term = $term.replace(/-/g, '').trim();
            console.log('prop11/eVar11: ' + 'vol_quicktopicsearch');
            console.log('prop14/eVar14: ' + $term);
            // NCIAnalytics.SearchOptions($(this), $term, 'vol_quicktopicsearch');
        })
    } 

}


/**
 * Function to retrieve query parameter values
 * @param {any} name 
 * @param {any} url 
 * @returns 
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
