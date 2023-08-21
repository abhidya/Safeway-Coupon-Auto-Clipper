// ==UserScript==
// @name         Safeway Coupon Auto-clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto click "Load more" and "Clip Coupon" buttons on Safeway's deals page with adjustable delays
// @author       abhidya
// @match        https://www.safeway.com/foru/coupons-deals.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Set your desired delays here
    const COUPON_CLICK_DELAY = 2000;  // Delay (in milliseconds) between clicking each coupon. Default: 2 seconds
    const LOAD_MORE_DELAY = 10000;    // Delay (in milliseconds) after clicking the "Load more" button. Default: 10 seconds

    // Function to click the "Load more" button
    function clickLoadMore() {
        const loadMoreButton = document.querySelector('.btn.load-more');
        if (loadMoreButton) {
            loadMoreButton.click();
            // Wait for the defined delay before checking for coupons again
            setTimeout(observeCoupons, LOAD_MORE_DELAY);
        }
    }

    // Function to recursively click each coupon with a delay
    function clickCoupon(couponButtons, index) {
        if (index < couponButtons.length) {
            couponButtons[index].click();
            // Wait for the defined delay between clicking each coupon
            setTimeout(() => clickCoupon(couponButtons, index + 1), COUPON_CLICK_DELAY);
        } else {
            // After all coupons are clicked, try to click "Load More" after a short delay
            setTimeout(clickLoadMore, 5000);
        }
    }

    // Function to observe available coupons and initiate the clicking process
    function observeCoupons() {
        const couponButtons = document.querySelectorAll('.btn.grid-coupon-btn.btn-default');
        if (couponButtons.length > 0) {
            clickCoupon(couponButtons, 0);
        } else {
            setTimeout(clickLoadMore, 5000);
        }
    }

    // MutationObserver to watch for changes in the page content
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                observeCoupons();
            }
        }
    });

    // Begin observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

})();
