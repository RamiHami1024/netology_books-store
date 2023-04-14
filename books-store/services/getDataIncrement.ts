import axios from 'axios'

export async function getData(id) {
    try {
        return await axios.get(`http://counter:3002/counter/${id}/incr`)
            .then(resp => {
                return resp.data
            })
    } catch (e) {
        return 'Данные не найдены'
    }
}