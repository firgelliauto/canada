
function addReviews(names, descriptions, ratings){
    var reviewsArray = [];
    for(i = 0; i < names.length; i++){
        var name = names[i];
        var description = descriptions[i];
        var starRating = ratings[i];

        reviewsArray.push({
            "@type": "Review",
            "name": name,
            "reviewBody": description,
            "author": {
                "@type": "Person",
                "name": name
            },
            "name": name,
            "datePublished": "2024-01-08",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": starRating
            },
            "publisher": {
                "@type": "Organization",
                "name": "Shopify Product Reviews"
            }
        });
        
    }
    return reviewsArray;
}

//main function to start adding names and descriptions to schema
function addReviewsToSchema(names, descriptions, ratings){
    var names = names.map(function(name) {
        return name.trim();
    });
    var descriptions = descriptions.map(function(description) {
        return description.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');
    });

    var reviewsArray = addReviews(names, descriptions, ratings);
    var productSchemaScript = findProductSchemaScript();

    var schemaData = JSON.parse(productSchemaScript.textContent);
    schemaData.review = reviewsArray;
    schemaData.aggregateRating = [{
        "@type": "AggregateRating",
        "ratingValue": 10,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": ratings.length
    }];
    productSchemaScript.textContent = JSON.stringify(schemaData, null, 2);
    //console.log("removing");
    //document.querySelectorAll('script[type="application/ld+json"]')[0].remove();
    //console.log(productSchemaScript.outerHTML);

}

function findProductSchemaScript() {
    var scriptElements = document.querySelectorAll('script[type="application/ld+json"]');
    return scriptElements[0];
}

function getMaxToFind(){
    return parseInt(document.querySelector('.reviews-num').textContent);
}

function waitForElementToExist(identifier, isClass, count, callback, interval = 500) {
    const checkElement = () => {
        const targetNode = isClass ? document.querySelectorAll('.' + identifier)[count] : document.getElementById(identifier);
        if (targetNode && targetNode.innerHTML.trim() !== '') {
            callback(targetNode);
        } else{
            console.log("doesnt exist yet");
            setTimeout(checkElement, interval);
        }
    };
    checkElement();
}

function setUpObserverForElement(identifier, isClass, count, callback) {
    let targetNode;
    if (isClass) {
        const elements = document.querySelectorAll('.' + identifier);
        if (elements.length > count) {
            targetNode = elements[count];
            if (targetNode.innerHTML.trim() !== '') {
                callback();
                return true;
            }
        } else {
            console.error('Element not found.');
            return false;
        }
    } else {
        targetNode = document.getElementById(identifier);
        if (!targetNode) {
            console.error('Element not found.');
            return false;
        }
    }

    const observer = new MutationObserver(() => {
        //console.log('Mutation observed:');
        observer.disconnect();
        callback();
        return true;
    });

    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
    return observer;
}

function getStarRating(element){
    var reviewDiv = document.getElementsByClassName('vstar-star')[element+1];
    //console.log(reviewDiv.querySelectorAll('.nostar'));
    return 5 - reviewDiv.querySelectorAll('.nostar').length;
}


function initiation() {
    //document.querySelectorAll('script[type="application/ld+json"]')[0].remove();
    var countFound = 0;
    var names = [];
    var descriptions = [];
    var ratings = [];
    waitForElementToExist('reviews-num', true, 0, function(targetNode) {
        document.querySelectorAll('script[type="application/ld+json"]')[0].remove();
        setUpObserverForElement('reviews-num', true, 0, function() {
            
            var maxToFind = getMaxToFind();
            fetchFiveReviews(maxToFind, names, descriptions, ratings);
        });
    });
}

function fetchFiveReviews(maxToFind, names, descriptions, ratings){
    //5 as thats the amount shown per pagnate.
    for (let i = 0; i < 5; i++) {
        setUpObserverForElement('author-name', true, i, function(count) {
            return function() {
                names[names.length] = document.querySelectorAll('.author-name')[count].innerHTML;
                setUpObserverForElement('reviews-text', true, i, function(count) {
                    return function() {
                        ratings[descriptions.length] = getStarRating(i);
                        descriptions[descriptions.length] = document.querySelectorAll('.reviews-text')[count].innerHTML;
                        if(i === 4 && names.length < maxToFind){
                            setUpObserverForElement('reviews-body', false, i, function(count) {
                                return function() {
                                    fetchFiveReviews(maxToFind, names, descriptions, ratings);
                                }
                            }(i));
                            document.querySelector('.next-page').click();
                        }
                        else if(i === 4 && names.length >= maxToFind){
                            addReviewsToSchema(names, descriptions, ratings);
                        }
                    };
                }(i));
            };
        }(i));
    }
}

window.onload = function() {
    initiation();
};
//scriptElements = document.querySelectorAll('script[type="application/ld+json"]')[0].remove();
