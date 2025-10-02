import moment from "moment";

export const formatDateTime = (dateString: string, format: string) => {
    try {
        return moment.utc(dateString)
            .local()
            .format(format);
    } catch (error) {
        return 'N/A';
    }
};
