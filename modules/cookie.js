/**
 * Writes a cookie with given name, value and expire days. If value and expire days are undefined, the cookie will
 * be deleted instead.
 * @param {string} cname name of cookie
 * @param {string} cvalue value of cookie
 * @param {number} exdays number of days until the cookie should expire 
 */
function write(cname, cvalue, exdays) {
    if (cvalue === undefined && exdays === undefined) {
        document.cookie = `${cname}=; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    } else {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1_000));
        document.cookie = `${cname}=${cvalue}; SameSite=Strict; expires=${d.toUTCString()}; path=/`;
    }
}

/**
 * Reads a cookie with given name.
 * @param {string} cname name of cookie
 * @returns value if the cookie if successful, undefined else
 */
function read(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

/**
 * Deletes a cookie with given name.
 * @param {string} cname name of cookie to delete
 */
function erase(cname) {
    write(cname);
}

export { write, read, erase }