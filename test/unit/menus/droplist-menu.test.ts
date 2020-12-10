/**
 * @description droplist menu test
 * @author luochao
 */

import DropListMenu from '../../../src/menus/menu-constructors/DropListMenu'
import DropList from '../../../src/menus/menu-constructors/DropList'
import createEditor from '../../helpers/create-editor'
import $ from '../../../src/utils/dom-core'

describe('dropList menu', () => {
    test('初始化基本的下拉菜单', () => {
        const editor = createEditor(document, 'div1', '', {
            lang: 'en',
        })

        const mockClickFn = jest.fn((value: string) => value)
        const menuEl = $('<div id="menu1"></div>')
        const conf = {
            title: '设置标题',
            type: 'list',
            width: 100,
            clickHandler: mockClickFn,
            list: [
                {
                    value: 'test123',
                    $elem: $('<span>test123</span>'),
                },
            ],
        }

        const droplistMenu = new DropListMenu(menuEl, editor, conf)
        expect(droplistMenu.dropList instanceof DropList).toBeTruthy()
    })

    test('初始化基本的下拉菜单，模拟菜单点击会展开下来菜单', () => {
        const editor = createEditor(document, 'div1', '', {
            lang: 'en',
        })

        const mockClickFn = jest.fn((value: string) => value)
        const menuEl = $('<div id="menu1"></div>')
        const conf = {
            title: '设置标题',
            type: 'list',
            width: 100,
            clickHandler: mockClickFn,
            list: [
                {
                    value: 'test123',
                    $elem: $('<span>test123</span>'),
                },
            ],
        }

        new DropListMenu(menuEl, editor, conf)

        const event = new MouseEvent('mouseenter', {
            view: window,
            bubbles: true,
            cancelable: true,
        })

        menuEl.elems[0].dispatchEvent(event)
    })
})
