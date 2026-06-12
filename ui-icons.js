const UI_ICON_REGISTRY = {
    user: '<circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 19.25c1.55-3.4 4.1-5.1 6.5-5.1s4.95 1.7 6.5 5.1"></path>',
    archive: '<path d="M4.5 7.25h15"></path><path d="M6.25 7.25V18.5a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1V7.25"></path><path d="M9.5 11.25h5"></path><path d="M8.5 4.5h7"></path>',
    sliders: '<path d="M5 6.5h14"></path><path d="M8 6.5v4"></path><path d="M5 17.5h14"></path><path d="M16 13.5v4"></path><circle cx="8" cy="11.5" r="1.5"></circle><circle cx="16" cy="12.5" r="1.5"></circle>',
    calendar: '<rect x="4.75" y="5.5" width="14.5" height="13" rx="2"></rect><path d="M8 4.5v3"></path><path d="M16 4.5v3"></path><path d="M4.75 9.5h14.5"></path><path d="M8.25 13h2"></path><path d="M13.5 13h2"></path><path d="M8.25 16.5h2"></path>',
    newspaper: '<rect x="5" y="5.25" width="14" height="13.5" rx="2"></rect><path d="M8 9h8"></path><path d="M8 12.25h8"></path><path d="M8 15.5h5"></path><path d="M15.25 15.5h.01"></path>',
    mail: '<rect x="4.75" y="6.5" width="14.5" height="11" rx="2"></rect><path d="m5.25 8.25 6.75 5 6.75-5"></path><path d="m8.75 12.75-3.5 3.25"></path><path d="m15.25 12.75 3.5 3.25"></path>',
    flag: '<path d="M6 20V5.25"></path><path d="M6.75 6c2.9-1.6 5.1 1.8 8 0 1.35-.85 2.6-1 3.25-.9v7.4c-.65-.1-1.9.05-3.25.9-2.9 1.8-5.1-1.6-8 0"></path>',
    palette: '<path d="M12 4.75c4.55 0 8.25 3.08 8.25 6.88 0 2.98-2.1 5.37-4.7 5.37h-1.2c-.7 0-1.27.58-1.27 1.28 0 .9-.73 1.64-1.63 1.64-4.6 0-8.45-3.55-8.45-7.75 0-4.3 4.1-7.42 8.99-7.42Z"></path><circle cx="8" cy="10" r="1"></circle><circle cx="11.25" cy="8.5" r="1"></circle><circle cx="14.75" cy="9.25" r="1"></circle><circle cx="16" cy="12.5" r="1"></circle>',
    gift: '<rect x="5" y="8.5" width="14" height="10" rx="2"></rect><path d="M12 8.5v10"></path><path d="M5 12.5h14"></path><path d="M12 8.5c-1.85 0-3.75-.85-3.75-2.6 0-1.15.85-1.9 1.95-1.9 1.55 0 2.5 1.8 1.8 4.5"></path><path d="M12 8.5c1.85 0 3.75-.85 3.75-2.6 0-1.15-.85-1.9-1.95-1.9-1.55 0-2.5 1.8-1.8 4.5"></path>',
    history: '<path d="M5.5 11.75A6.5 6.5 0 1 1 8 17"></path><path d="M5.75 6.5v5.25H11"></path><path d="M4 9.25 5.75 6.5 8.5 8.25"></path>',
    megaphone: '<path d="M12.5 7.5 18 5.5v10l-5.5-2"></path><path d="M6.5 9h6v5h-6a2 2 0 0 1-2-2.5A2.5 2.5 0 0 1 6.5 9Z"></path><path d="M7.5 14v3.25"></path>',
    chevronLeft: '<path d="m14.75 5.5-6.5 6.5 6.5 6.5"></path>',
    chevronRight: '<path d="m9.25 5.5 6.5 6.5-6.5 6.5"></path>',
    trash: '<path d="M5.5 7.25h13"></path><path d="M9 7.25V5.5h6v1.75"></path><path d="M7.5 7.25v10.25a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7.25"></path><path d="M10 10.25v5"></path><path d="M14 10.25v5"></path>',
    journal: '<path d="M7 5.25h9.5a2 2 0 0 1 2 2V19H9a2 2 0 0 1-2-2V5.25Z"></path><path d="M7 5.25v12a2 2 0 0 0 2 2"></path><path d="M10 9.25h5.5"></path><path d="M10 12.5h5.5"></path>',
    download: '<path d="M12 4.5v10"></path><path d="m8.25 11.5 3.75 3.75 3.75-3.75"></path><path d="M5.5 18.75h13"></path>',
    upload: '<path d="M12 19.5v-10"></path><path d="m8.25 12.5 3.75-3.75 3.75 3.75"></path><path d="M5.5 5.25h13"></path>',
    spark: '<path d="m12 4.5 1.45 4.05L17.5 10l-4.05 1.45L12 15.5l-1.45-4.05L6.5 10l4.05-1.45Z"></path><path d="m18 15.25.6 1.7 1.65.55-1.65.6-.6 1.65-.55-1.65-1.7-.6 1.7-.55Z"></path><path d="m5.5 14 .75 2.1 2.15.7-2.15.75-.75 2.1-.7-2.1-2.1-.75 2.1-.7Z"></path>',
    chat: '<path d="M6.5 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H11l-4.5 3v-3H6.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"></path>',
    activity: '<rect x="4.75" y="5.5" width="14.5" height="13" rx="3"></rect><path d="M8 13h2.25l1.3-2.1 2.1 4.2L15.5 12H17"></path>',
    trophy: '<path d="M8.5 5.25h7v3.5A3.5 3.5 0 0 1 12 12.25a3.5 3.5 0 0 1-3.5-3.5Z"></path><path d="M8.5 6.25H6.75a1.75 1.75 0 0 0 0 3.5H8"></path><path d="M15.5 6.25h1.75a1.75 1.75 0 0 1 0 3.5H16"></path><path d="M12 12.25V16"></path><path d="M9.25 19h5.5"></path><path d="M10.25 16h3.5"></path>',
    heart: '<path d="M12 19s-6.75-4.35-6.75-9a3.55 3.55 0 0 1 6.1-2.55L12 8.1l.65-.65A3.55 3.55 0 0 1 18.75 10c0 4.65-6.75 9-6.75 9Z"></path>',
    signal: '<path d="M5.25 17.5h1.5"></path><path d="M8.75 15h1.5"></path><path d="M12.25 12.5h1.5"></path><path d="M15.75 10h1.5"></path>',
    battery: '<rect x="4.5" y="8.25" width="14" height="7.5" rx="2"></rect><path d="M18.5 10.25h1.25v3H18.5"></path><path d="M7.25 10.75h7"></path>',
    send: '<path d="m4.75 12 14-6-3 12-4.2-4.2L4.75 12Z"></path><path d="M11.5 13.75 18.75 6"></path>',
    group: '<circle cx="9" cy="9" r="2.5"></circle><circle cx="15.25" cy="10.25" r="2"></circle><path d="M4.75 18c1.2-2.65 3.05-4 4.95-4s3.75 1.35 4.95 4"></path><path d="M13.25 18c.55-1.55 1.7-2.65 3.45-3"></path>',
    image: '<rect x="4.75" y="6" width="14.5" height="12" rx="2"></rect><circle cx="9" cy="10" r="1.4"></circle><path d="m7 16 3.25-3 2.25 2 2.25-2.25L17 16"></path>',
    close: '<path d="m7 7 10 10"></path><path d="M17 7 7 17"></path>',
    coin: '<ellipse cx="12" cy="7.5" rx="5" ry="2.5"></ellipse><path d="M7 7.5v5c0 1.4 2.25 2.5 5 2.5s5-1.1 5-2.5v-5"></path><path d="M7 12.5v4c0 1.4 2.25 2.5 5 2.5s5-1.1 5-2.5v-4"></path>',
    wheel: '<circle cx="12" cy="12" r="6.5"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 5.5v4.5"></path><path d="m6.4 9 3.9 2.25"></path><path d="m17.6 9-3.9 2.25"></path><path d="M12 14v4.5"></path>',
    coffee: '<path d="M6 8h8.5v5.5A3.5 3.5 0 0 1 11 17a5 5 0 0 1-5-5V8Z"></path><path d="M14.5 9.25h1.5a1.75 1.75 0 1 1 0 3.5h-1.5"></path><path d="M7 19h8"></path><path d="M8.5 5.25c1 1 .2 1.8 1.2 2.8"></path><path d="M11.5 5.25c1 1 .2 1.8 1.2 2.8"></path>',
    piano: '<rect x="5" y="5.75" width="14" height="12.5" rx="2"></rect><path d="M8 8.5v7"></path><path d="M11 8.5v7"></path><path d="M14 8.5v7"></path><path d="M17 8.5v7"></path>',
    glove: '<path d="M9.25 6.25v5"></path><path d="M11.5 5.5v5.75"></path><path d="M13.75 5.25v6"></path><path d="M16 6.5v6"></path><path d="M8.75 11.25 6.5 10.5l-1.25 2.25 2.25 4.5c.4.8 1.2 1.3 2.1 1.3h5.3c1.2 0 2.18-.95 2.25-2.15l.35-6.15a1.7 1.7 0 0 0-1.7-1.8h-.9"></path>',
    wine: '<path d="M8 5.5h8v1.75A4 4 0 0 1 12 11.25 4 4 0 0 1 8 7.25Z"></path><path d="M12 11.25v5.25"></path><path d="M9.25 19h5.5"></path>',
    bowl: '<path d="M6 11.5h12a6 6 0 0 1-12 0Z"></path><path d="M8 11.5 12 7l4 4.5"></path>',
    can: '<rect x="8" y="5.25" width="8" height="13.5" rx="2.5"></rect><path d="M9.5 8.25h5"></path><path d="M9.5 15.75h5"></path>',
    headphones: '<path d="M5.5 12a6.5 6.5 0 0 1 13 0"></path><rect x="5.25" y="11.75" width="2.5" height="5.5" rx="1.25"></rect><rect x="16.25" y="11.75" width="2.5" height="5.5" rx="1.25"></rect>',
    bicycle: '<circle cx="7.25" cy="16.25" r="2.5"></circle><circle cx="16.75" cy="16.25" r="2.5"></circle><path d="M9.75 16.25 12 11.5h3.25"></path><path d="m10.25 8.25 1.75 3.25-4.75 4.75"></path><path d="m13 11.5 3.75 4.75"></path>',
    sport: '<path d="M7.25 8.25h9.5"></path><path d="m8 8.25-1.75 7.5"></path><path d="m16 8.25 1.75 7.5"></path><path d="M6.75 15.75h10.5"></path>',
    noodles: '<path d="M6 9.75h12"></path><path d="M7 13.5c0 2.2 2.2 4 5 4s5-1.8 5-4"></path><path d="M9.25 8V5.5"></path><path d="M12 8V5"></path><path d="M14.75 8V5.75"></path>',
    box: '<path d="m12 4.75 7 3.5-7 3.5-7-3.5 7-3.5Z"></path><path d="M5 8.25v7l7 4 7-4v-7"></path><path d="M12 11.75v7.5"></path>',
    film: '<rect x="5" y="5.25" width="14" height="13.5" rx="2"></rect><path d="M8 5.25v13.5"></path><path d="M16 5.25v13.5"></path><path d="M5 9h14"></path><path d="M5 15h14"></path>',
    flame: '<path d="M13.5 5.25c.55 2.55-1.15 3.55-1.15 5.45 0 .95.65 1.8 1.7 1.8a2.1 2.1 0 0 0 2.1-2.2c0-2.2-1.55-4.2-2.65-5.05Z"></path><path d="M11 9c-2.25 1.25-4.25 3.2-4.25 6a5.25 5.25 0 0 0 10.5 0c0-1.85-.9-3.55-2.15-4.8"></path>',
    jacket: '<path d="m9 5 3-1 3 1 2.25 4.25-2.25 1.5v8.25H9v-8.25L6.75 9.25 9 5Z"></path><path d="M12 4v6"></path>',
    speaker: '<path d="M5.5 14.5V9.5h3.25L13 6.25v11.5l-4.25-3.25H5.5Z"></path><path d="M16 9.25c1 .85 1.5 1.75 1.5 2.75s-.5 1.9-1.5 2.75"></path><path d="M17.75 7.25c1.7 1.35 2.75 2.95 2.75 4.75s-1.05 3.4-2.75 4.75"></path>',
    beer: '<path d="M7 6h7.5v8.25A3.75 3.75 0 0 1 10.75 18h0A3.75 3.75 0 0 1 7 14.25V6Z"></path><path d="M14.5 8h1.25a1.75 1.75 0 0 1 0 3.5H14.5"></path><path d="M8 10h5.5"></path>',
    palm: '<path d="M12 19v-6"></path><path d="M12 13c0-4.5 2.2-7 6.25-8.25"></path><path d="M12 13c0-4.1-1.9-6.3-5.75-7.5"></path><path d="M12 13c1.75-2.2 4.2-3.2 7.25-3"></path><path d="M12 13c-1.75-2.2-4.2-3.2-7.25-3"></path>',
    rugby: '<path d="M12 6c2.15 1.15 4.7 3.75 5.75 6-.75 2-3.15 4.55-5.75 6-2.6-1.45-5-4-5.75-6 1.05-2.25 3.6-4.85 5.75-6Z"></path><path d="M9.5 10.5 14.5 13.5"></path><path d="M14.5 10.5 9.5 13.5"></path>',
    keyboard: '<rect x="4.75" y="7" width="14.5" height="10" rx="2"></rect><path d="M7.5 10h.01"></path><path d="M10.5 10h.01"></path><path d="M13.5 10h.01"></path><path d="M16.5 10h.01"></path><path d="M7.5 13h9"></path>',
    taco: '<path d="M6 13a6 6 0 0 1 12 0H6Z"></path><path d="M8 13c.65.6 1.35.9 2.1.9.9 0 1.2-.65 2.1-.65.95 0 1.2.65 2.2.65.85 0 1.35-.3 2.1-.9"></path>',
    wood: '<path d="M8 6.5h8v11H8Z"></path><path d="M10 6.5v11"></path><path d="M14 6.5v11"></path><path d="M8 11h8"></path>'
};

function getUiIconMarkup(iconName, className = '', label = '') {
    const icon = UI_ICON_REGISTRY[iconName] || UI_ICON_REGISTRY.spark;
    const safeClass = className ? ` ${className}` : '';
    const safeLabel = label ? ` aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
    return `<svg class="ui-icon${safeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"${safeLabel}>${icon}</svg>`;
}

function injectUiIcons(root = document) {
    root.querySelectorAll?.('[data-ui-icon]').forEach(node => {
        const iconName = node.dataset.uiIcon || 'spark';
        const label = node.dataset.iconLabel || '';
        const extraClass = node.dataset.iconClass || '';
        node.innerHTML = getUiIconMarkup(iconName, extraClass, label);
    });
}

window.getUiIconMarkup = getUiIconMarkup;
window.injectUiIcons = injectUiIcons;
