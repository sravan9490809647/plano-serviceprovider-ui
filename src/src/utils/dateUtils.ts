import moment from "moment";

export const DATE_FORMAT = 'MM-DD-YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const DATE_TIME_FORMAT_UTC = 'YYYY-MM-DDTHH:mm:ss';
export const formatDateTime = (dateString: string, format: string) => {
    try {
        return moment.utc(dateString)
            .local()
            .format(format);
    } catch (error) {
        return 'N/A';
    }
};


export const formatDate = (dateString: string) => {
    try {
        const date = moment(dateString);
        const today = moment().startOf('day');

        if (date.isSame(today, 'day')) {
            return date.format('HH:mm');
        } else if (date.isSame(today.clone().subtract(1, 'day'), 'day')) {
            return 'Yesterday';
        } else {
            return date.format('DD/MM/YYYY');
        }
    } catch (error) {
        return 'N/A';
    }
};

export const formatDateAsUTC = (dateString?: string, format?: string) => {
    return dateString ? moment.utc(dateString).format(format || DATE_FORMAT) : moment.utc().format(format || DATE_FORMAT);
};

export const formatDateAsLocal = (dateString?: string, format?: string) => {
    return dateString ? moment(dateString).format(format || DATE_FORMAT) : moment().format(format || DATE_FORMAT);
};

export const formatMomentDate = (dateString?: string, format?: string) => {
    return dateString ? moment(dateString).format(format || DATE_FORMAT) : moment().format(format || DATE_FORMAT);
};

export const formatDateAsLocalUTC = (dateString?: string, format?: string) => {
    return moment.utc(dateString).format(format || DATE_TIME_FORMAT_UTC);
};