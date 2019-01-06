export class EncodingUtils {
    public static decodeBase64(str: string) {
        if (str != null) {
            let result = Buffer.from(str, 'base64').toString('ascii');
            return result;
        }

        return null;
    }
}