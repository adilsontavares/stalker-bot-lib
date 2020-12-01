type Direction = -1 | 0 | 1

const SERVER_MODE = (process.env.SERVER_MODE == 'true')

export default class Output {

    static write(text: string, writeToServer: boolean = true) {
        if (!SERVER_MODE || writeToServer) {
            process.stdout.write(text)
        }
    }

    static clearLine(dir: Direction) {
        if (!SERVER_MODE) {
            process.stdout.clearLine(dir)
        }
    }

    static clearScreenDown() {
        if (!SERVER_MODE) {
            process.stdout.clearScreenDown()
        }
    }

    static log(message?: any, ...optionalParams: any[]) {
        console.log(message || '', ...optionalParams)
    }
}