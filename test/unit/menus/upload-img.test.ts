/**
 * @description upload-img test
 * @author luochao
 */
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import mockFile from '../../helpers/mock-file'
import mockXHR from '../../helpers/mock-xhr'
import Editor from '../../../src/editor'
import UploadImg from '../../../src/menus/img/upload-img'

let editor: Editor
let id = 1

const imgUrl = 'http://www.wangeditor.com/imgs/logo.jpeg'
const errorUrl = 'logo123.jpeg'

describe('upload img', () => {
    // mock img onload and onerror event
    beforeAll(() => {
        // Mocking Image.prototype.src to call the onload or onerror
        // callbacks depending on the src passed to it
        Object.defineProperty(global.Image.prototype, 'src', {
            // Define the property setter
            set(src) {
                if (src === errorUrl) {
                    // Call with setTimeout to simulate async loading
                    setTimeout(() => this.onerror(new Error('mocked error')))
                } else if (src === imgUrl) {
                    setTimeout(() => this.onload())
                }
            },
        })
    })

    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    test('能够初始化基本的UploadImg类', () => {
        const uploadImg = new UploadImg(editor)

        expect(uploadImg.insertImg instanceof Function).toBeTruthy()
        expect(uploadImg.uploadImg instanceof Function).toBeTruthy()
    })

    test('调用 insertImg 可以网编辑器里插入图片', () => {
        const uploadImg = new UploadImg(editor)

        mockCmdFn(document)

        document.queryCommandSupported = jest.fn(() => true)

        uploadImg.insertImg(imgUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<img src="${imgUrl}" style="max-width:100%;"/>`
        )
    })

    test('调用 insertImg 可以网编辑器里插入图片，可以监听插入图片回调', () => {
        const callback = jest.fn()

        const editor = createEditor(document, `div${id++}`, '', {
            linkImgCallback: callback,
        })
        const uploadImg = new UploadImg(editor)

        mockCmdFn(document)

        document.queryCommandSupported = jest.fn(() => true)

        uploadImg.insertImg(imgUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<img src="${imgUrl}" style="max-width:100%;"/>`
        )
        expect(callback).toBeCalledWith(imgUrl)
    })

    test('调用 insertImg 可以网编辑器里插入图片，插入图片加载失败可以通过customAlert配置错误提示', done => {
        expect.assertions(1)

        const alertFn = jest.fn()

        const editor = createEditor(document, `div${id++}`, '', {
            customAlert: alertFn,
        })

        const uploadImg = new UploadImg(editor)

        mockCmdFn(document)

        uploadImg.insertImg(errorUrl)

        setTimeout(() => {
            expect(alertFn).toBeCalledWith(
                '插入图片错误',
                'error',
                `wangEditor: 插入图片错误，图片链接 "${errorUrl}"，下载链接失败`
            )
            done()
        }, 1000)
    })

    test('调用 uploadImg 上传图片', done => {
        expect.assertions(1)

        const jestFn = jest.fn()

        const editor = createEditor(document, `div${id++}`, '', {
            uploadImgServer: 'http://localhost:8881/api/upload-img',
            uploadImgHooks: {
                success: jestFn,
            },
        })

        const upload = new UploadImg(editor)
        const files = [mockFile({ name: 'test.png', size: 512, mimeType: 'image/png' })]
        const mockXHRObject = mockXHR({
            status: 200,
            res: JSON.stringify({ data: ['url1'], errno: 0 }),
        })

        const mockObject = jest.fn().mockImplementation(() => mockXHRObject)

        // @ts-ignore
        window.XMLHttpRequest = mockObject

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(jestFn).toBeCalled()
            done()
        }, 1000)
    })
})
