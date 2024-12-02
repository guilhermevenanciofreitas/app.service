'use strict';

import {server} from './express/server.js';

server.listen(3000, () => console.log('Local app listening on port 3000!'));
