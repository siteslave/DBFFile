'use strict';
import * as path from 'path';
import * as _ from 'lodash';
import {async, await} from 'asyncawait';
import {expect} from 'chai';
import * as DBFFile from 'dbffile';


describe('Reading a DBF file', () => {

    let tests = [
        {
            filename: 'PYACFL.DBF',
            rowCount: 15,
            firstRow: { AFCLPD: 'W', AFHRPW: 2.92308, AFLVCL: 0.00, AFCRDA: new Date(1999, 3, 25), AFPSDS: '' },
            error: null
        },
        {
            filename: 'dbase_03.dbf',
            rowCount: null,
            firstRow: null,
            error: `Duplicate field name: 'Point_ID'`
        }
    ];

    tests.forEach(test => {
        it(test.filename, async.cps (() => {
            let filepath = path.join(__dirname, `./fixtures/${test.filename}`);
            let expectedRows = test.rowCount;
            let expectedData = test.firstRow;
            let expectedError = test.error;
            let actualRows = null;
            let actualData = null;
            let actualError = null;
            try {
                let dbf = await (DBFFile.open(filepath));
                let rows = await (dbf.readRecords(100));
                actualRows = dbf.recordCount;
                actualData = _.pick(rows[0], _.keys(expectedData));
            }
            catch (ex) {
                actualError = ex.message;
            }
            if (expectedError || actualError) {
                expect(actualError).equals(expectedError);
            }
            else {
                expect(actualRows).equals(expectedRows);
                expect(actualData).deep.equal(expectedData);
            }
        }));
    });
});
