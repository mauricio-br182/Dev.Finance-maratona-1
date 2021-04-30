const Modal =
{
    open() {
        document.querySelector('.modal-overlay').classList.add('active')

    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')

    }
}

const Storage = {

    get(){
        return JSON.parse(localStorage.getItem('devFinance:Transactions')) || []
    },
    set(transactions){
        localStorage.setItem('devFinance:Transactions', JSON.stringify(transactions))
    }
   
}

const Transaction = {
    all: Storage.get()
    ,
    add(data) {
        Transaction.all.push(data,)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes()//pegar as transações 

    {
        let income = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income = income + transaction.amount
            }
        }); return income
    },
    expenses() {
        let expense = 0

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense = expense + transaction.amount
            }
        });

        return expense
        //calculo de saida
    },
    total() {
        let total = 0

        Transaction.all.forEach(transaction =>
            total += transaction.amount
        )
        return total
        //total
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(datas, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(datas, index)
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction(datas, index) {
        const cssClass = (datas.amount > 0) ? 'income' : 'expense'

        const amount = Utils.formatCurrency(datas.amount)

        const html =
            `
            <td class="date">${datas.description}</td>
            <td class="${cssClass}">${amount}</td>
            <td class="date">${datas.date}</td>
            <td>
              <img onclick="Transaction.remove(${index})"src="assets/minus.svg" alt="deletar transação" />
            </td>
        `
        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ''
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g, '')
        value = Number(value) / 100
        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })



        return (signal + value)
    },
    formatAmount(value){

        value = Number(value) * 100

        return(value)

    },
    formatDate(date){
        let splitedDate = date.split('-')
        return (`${splitedDate[2]} / ${splitedDate[1]} / ${splitedDate[0]}`)
    },
}

const Form = { 
    description: document.getElementById('description'),
    amount: document.getElementById('amount'),
    date: document.getElementById('date'),

    getValues(){
        
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
        
    },

    validateFilds() {
        const{ description, amount, date} = Form.getValues()

        if(description.trim() === '' ||
        amount.trim() ===  '' ||
        date.trim() === '') {
            throw new Error('Preencha todos os campos')
        }
    },

    formatValues(){
        let{ description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
        
    },

    saveTransaction(transaction){
         Transaction.add(transaction)
    },

    clearForm(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {

    event.preventDefault()

        try {
            Form.validateFilds()//verificar se os campos foram preenchidos
          
            const transaction = Form.formatValues()  //formatar os dados para salvar
            
            Form.saveTransaction(transaction)//salvar os dados e atualizar a aplicacao

            Form.clearForm()//apagar os dados do formulario
            
            Modal.close()//fechar o Modal 
            //
          

        } catch (error) {
            
            alert(error.message)
        }

    },
}

const App =
{

    init() {
        Transaction.all.forEach((data, index) => { DOM.addTransaction(data, index) })

        Storage.set(Transaction.all)

        DOM.updateBalance();
    },

    reload() {
        DOM.clearTransactions()

        App.init()
    }

}

App.init();

