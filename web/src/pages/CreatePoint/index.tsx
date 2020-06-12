import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
//ChangeEvent -> mudança de algum valor, um input...
import { Link, useHistory } from 'react-router-dom';
//useHistory permite navegar de um componente para outro sem ter um botão
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

//sempre que cria um estado pra um array ou um objeto, precisa informar manualmente o tipo da variável

//interface serve pra fazer a represntação do formato que o objeto vai ter
interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

//componente CreatePoint
const CreatePoint = () => {
    //criar estados:
    const [items, setItems] = useState<Item[]>([]);
    //estado items, função setItems pra setar o valor do estado
    //useState é uma função que aceita parâmetro(generic) que é um argumento de tipagem no TS.
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [selectedUf, setSelectedUf] = useState('0');
    //essa selectedUf vai armazenar qual UF o usuário selecionou
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
        //vai carregar a posição do usuário assim que iniciar a aplicação
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
    //useEffect é uma função que recebe dois parâmetros
    //primeiro parametro é: qual funçao quero executar e o segundo é quando quero executar
        api.get('items').then(response => {
        //a função vai ser disparada uma única vez independente que quantas vezes o componente CreatePoint mude
        //tudo o que estiver dentro desta função, vai ser executada assim que o componente for exibido em tela, uma única vez
        //items vem da rota
        //usa o then porque é uma promisse
        //vai buscar os items da api, assim que tiver uma resposta, console log
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            //console.log(ufInitials);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que a UF mudar
        if (selectedUf === '0') {
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
            const cityNames = response.data.map(city => city.nome);

            //console.log(ufInitials);
            setCities(cityNames);
        });
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    //essa função vai ser chamada toda vez que o usuário mudar a uf. Recebe um argumento de tipagem para dizer qual o elemento será alterado. No caso, está alterando um HTMLSelectElement (é uma variável global do react)
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }
    
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        //console.log(event.target.name, event.target.value)
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
        //spread operator, vai copiar tudo o que ja tem dentro de formData
        //incluuir uma informação, ou alterar
    }

    function handleSelectItem(id: number) {
        //verificar se o usuário ja clicou num item que ja tinha clicado
        const alreadySelected = selectedItems.findIndex(item => item === id);
        //findIndex vai retornar um numero >= 0 se ja tiver dentro do array, se nao retorna -1
        //findIndex vai pegar cada um dos itens e vai procurar se existe um item em que ele seja igual ao id
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            //vai conter todos os itens, menos o que eu quero remover, que é diferente do id
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        //tela nao vai recarregar
        event.preventDefault();

        //console.log(selectedFile);
        //return;

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();
        
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile);
        }

        //const data = {
        //    name,
        //    email,
        //    whatsapp,
        //    uf,
        //    city,
        //    latitude,
        //    longitude,
        //    items
        //};
        //console.log(data);

        await api.post('points', data);

        alert('Ponto de coleta criado!');

        //vai direcionar o usuário para a home
        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                            />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                />
                        </div>
                        <div className="field">
                            <label htmlFor="whastapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf"
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                        //map vai fazer uma varredura em items e para cada item, ele vai retornar:
                        //sempre que usa o map, o primeiro elemento do retorno dessa varredura deve ter a propriedade obrigatória chamada key, e deve ser o único item que tem valor único dentro do array
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                //verificar se item.id está dentro do array se items ja selecionados; se já inseriu ou nao o item
                                //se ja inseriu, vai colocar uma classe selected
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
};

export default CreatePoint;