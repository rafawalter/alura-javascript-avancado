var ConnectionFactory = (function() {

    const
        stores = ['negociacoes'],
        version = 4,
        dbName = 'aluraframe';

    var
        connection = null,
        close = null;

    return class ConnectionFactory {
        constructor() {

            throw new Error('Não é possível instânciar ConnectionFactory');
        }

        static getConnection() {

            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {

                    ConnectionFactory._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {
                    if (!connection) {
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function() {
                            throw new Error('Você não pode fechar diretamente a conexão');
                        };
                    }

                    resolve(connection);
                };

                openRequest.onerror = e => {

                    console.log(e.target.error);

                    reject(e.target.error.name);
                };
            });
        }

        static _createStores(connection) {

            stores.forEach(store => {
                if (connection.objectStoreNames.contains(store)) {
                    connection.deleteObjectStore(store);
                }

                connection.createObjectStore(store, { autoincremente: true });
            });
        }

        static closeConnection() {

            if (connection) {
                close();
                connection = null;
            }
        }
    };
})();