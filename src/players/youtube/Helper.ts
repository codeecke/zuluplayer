export class Helper {
    getQueryParameters(url: string): {[key: string]: string} {
        const result: {[key: string]: string} = {};
        const queryString = url.split('?')[1];
        if(!queryString) return result;
        queryString.split('&').forEach(queryCoupleAsString => {
            const queryCouple = queryCoupleAsString.split('=');
            const key: string = queryCouple[0];
            const value: string = queryCouple[1];

            result[key] = value;
        });

        return result;
    }

    getVideoId(url: string) {

        let shortUrl;

        if(shortUrl = url.match(/youtu\.be\/([a-zA-Z0-9\-\_]+)/)) {
            return shortUrl[1]
        }
        const queryParameters = this.getQueryParameters(url);
        return queryParameters['v'];
    }

    getDomain(url: string) {
        const aTag = document.createElement('a');
        aTag.href = url;

        return aTag.hostname;
    }

    getPath(url: string) {
        const aTag = document.createElement('a');
        aTag.href = url;

        return aTag.pathname;
    }
}