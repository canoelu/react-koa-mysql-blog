import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();

const isListPath = (path, names) => {
    const reg = new RegExp(`/(?:${names.join('|')})/list(?:/(\\d+))?`);
    return reg.test(path)
}
const getPageFromPath = (path, names) => {
    const reg = new RegExp(`/(${names.join('|')})/list(?:/(\\d+))?`);
    const result = path.match(reg);
    let page = 1;
    let name = '';
    if (result && result.length) {
        page = Number(result[2]) || 0;
        name = result[1]
    }
    return {page, name}
}
export {
    history, isListPath, getPageFromPath
}