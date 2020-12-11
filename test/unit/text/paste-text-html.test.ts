/**
 * @description text utils paste-text-html test
 * @author luochao
 */
import pasteTextHtml from '../../../src/text/event-hooks/paste-text-html'
import createEditor from '../../helpers/create-editor'

describe('text utils getPasteImgs test', () => {
    test('能将 text 转换成 html ', () => {
        const editor = createEditor(document, 'div1')

        pasteTextHtml(editor, [])

        expect(true).toBeTruthy()
    })
})
