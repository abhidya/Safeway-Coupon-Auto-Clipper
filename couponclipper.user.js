// ==UserScript==
// @name         Safeway Coupon Auto-clicker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Inspect or click "Load more" and "Clip Coupon" buttons on Safeway's deals page with adjustable delays
// @author       abhidya
// @match        https://www.safeway.com/foru/coupons-deals.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // Keep dry-run enabled unless you have reviewed the current site and terms.
        dryRun: true,
        couponClickDelay: 2000,
        loadMoreDelay: 10000,
        selectors: {
            coupon: '.btn.grid-coupon-btn.btn-default',
            loadMore: '.btn.load-more'
        }
    };

    let clicking = false;

    function actOnButton(button, label) {
        if (config.dryRun) {
            button.dataset.safewayAutoClipperSeen = 'true';
            console.log(`[Safeway Coupon Auto-clicker] dry-run would click ${label}`, button);
            return;
        }

        button.click();
    }

    // Function to click the "Load more" button
    function clickLoadMore() {
        const loadMoreButton = document.querySelector(config.selectors.loadMore);
        if (loadMoreButton) {
            actOnButton(loadMoreButton, 'load more');
            setTimeout(observeCoupons, config.loadMoreDelay);
        }
    }

    // Function to recursively click each coupon with a delay
    function clickCoupon(couponButtons, index) {
        if (index < couponButtons.length) {
            actOnButton(couponButtons[index], `coupon ${index + 1}`);
            setTimeout(() => clickCoupon(couponButtons, index + 1), config.couponClickDelay);
        } else {
            clicking = false;
            setTimeout(clickLoadMore, 5000);
        }
    }

    // Function to observe available coupons and initiate the clicking process
    function observeCoupons() {
        if (clicking) {
            return;
        }

        const couponButtons = document.querySelectorAll(`${config.selectors.coupon}:not([data-safeway-auto-clipper-seen="true"])`);
        if (couponButtons.length > 0) {
            clicking = true;
            clickCoupon(Array.from(couponButtons), 0);
        } else {
            setTimeout(clickLoadMore, 5000);
        }
    }

    // MutationObserver to watch for changes in the page content
    const observer = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                observeCoupons();
            }
        }
    });

    // Begin observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    observeCoupons();

})();
