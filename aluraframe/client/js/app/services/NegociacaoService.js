class NegociacaoService {
    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoes() {

        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), []);

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    obterNegociacoesDaSemana() {

        return this._obterNegociacoes('semana', 'semana');
    }


    obterNegociacoesDaSemanaAnterior() {

        return this._obterNegociacoes('anterior', 'semana anterior');
    }


    obterNegociacoesDaSemanaRetrasada() {

        return this._obterNegociacoes('retrasada', 'semana retrasada');
    }

    _obterNegociacoes(complementoUrl, titulo) {

        return this._http
            .get(`negociacoes/${complementoUrl}`)
            .then(negociacoes => {
                console.log(`negociacoes da ${titulo}`, negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error(`Não foi possível obter as negociações da ${titulo}`);
            });
    }
}