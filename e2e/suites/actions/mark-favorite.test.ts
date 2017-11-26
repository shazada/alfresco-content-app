/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { browser, protractor, promise } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Mark items as favorites', () => {
    const username = `user-${Utils.random()}`;

    const file1 = `file-${Utils.random()}.txt`;
    let file1Id;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id;

    const folder1 = `folder-${Utils.random()}`;
    let folder1Id;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ file1 ]).then(resp => file1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ file2 ]).then(resp => file2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder1 ]).then(resp => folder1Id = resp.data.entry.id))

            .then(() => apis.user.favorites.addFavoriteById('file', file2Id))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodeById(file1Id),
            apis.user.nodes.deleteNodeById(file2Id),
            apis.user.nodes.deleteNodeById(folder1Id),
            logoutPage.load()
        ])
        .then(done);
    });

    it('favorite a file', () => {
        dataTable.clickOnRowByContainingText(file1)
            .then(() => toolbar.actions.openMoreMenu())
            .then(menu => menu.getItemByLabel('Favorite').click())
            .then(() => {
                expect(apis.user.favorites.isFavorite(file1Id)).toBe(true, 'item is not marked as favorite');
            });
    });

    it('favorite a folder', () => {
        dataTable.clickOnRowByContainingText(folder1)
            .then(() => toolbar.actions.openMoreMenu())
            .then(menu => menu.getItemByLabel('Favorite').click())
            .then(() => {
                expect(apis.user.favorites.isFavorite(folder1Id)).toBe(true, 'item is not marked as favorite');
            });
    });

    it('unfavorite an item', () => {
        dataTable.clickOnRowByContainingText(file2)
            .then(() => toolbar.actions.openMoreMenu())
            .then(menu => menu.getItemByLabel('Favorite').click())
            .then(() => {
                expect(apis.user.favorites.isFavorite(file2Id)).toBe(false, 'item is marked as favorite');
            });
    });

    it('favorite multiple items - all unfavorite', () => {

    });

    // it('favorite multiple items - some favorite and some unfavorite', () => {

    // });

    // it('unfavorite multiple items', () => {

    // });

    // describe('from Favorites list view', () => {

    //     it('unfavorite multiple items', () => {

    //     });

    //     it('unfavorite multiple items', () => {

    //     });
    // });

});
