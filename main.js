// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

document.addEventListener('DOMContentLoaded', ()=>{
    const titleInput = document.querySelector("#inputBookTitle");
    const authorInput = document.querySelector("#inputBookAuthor");
    const yearInput = document.querySelector("#inputBookYear");
    const isCompleteInput = document.querySelector("#inputBookIsComplete");
    const bookSubmit = document.querySelector("#bookSubmit");
    const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
    const completeBookshelfList = document.querySelector("#completeBookshelfList");
    const searchBookTitle = document.querySelector("#searchBookTitle");
    const searchSubmit = document.querySelector("#searchSubmit");
    const visible = document.querySelector("#visible");
    const status = document.querySelector("#status");
    const STORAGE_KEY = "bookshelf"
    const REFRESH_DATA = "refresh"
    document.dispatchEvent(new Event(REFRESH_DATA))

    const createJSON = (id,title,author,year,isComplete) =>{
      return {id,title,author,year,isComplete}
    }
    const addDataToStorage = (new_data) =>{
      let data = []
      if(typeof(Storage)!=null)
      {
        if(localStorage.getItem(STORAGE_KEY))
        {
          data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
          console.log(data)
        }
        data.unshift(new_data)
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data))
        document.dispatchEvent(new Event(REFRESH_DATA))
      }
    }

    const isCompleteSwitch = (dataToBeUpdate) =>
    {
      console.log("switch",dataToBeUpdate)
      let data = getDataFromStorage();
      let index = data.findIndex((dt) => dt.id == dataToBeUpdate.id);
      if(index>=0)
      {
        console.log(data[index].isComplete)
        data[index].isComplete = !data[index].isComplete
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    }
    const deleteBook = (dataToBeDeleted)=>{
      console.log("deleting",dataToBeDeleted)
        let data = getDataFromStorage();
        let index = data.findIndex((dt) => dt.id == dataToBeDeleted.id);
        if(index>=0)
        {
          data.splice(index, 1);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          visible.innerText = `Buku ${dataToBeDeleted.title} berhasil di hapus`

          visible.style.top=`20%`;
          setTimeout(() =>visible.style.top="-100px",2000)
        }
    }

    const getDataFromStorage = () =>
    {
      return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]
    }

    const unfinishedBook = (data) =>{
      let book_item = document.createElement('article')
      book_item.classList.add("book_item")
      let title = document.createElement("h3")
      title.innerText = data.title
      let author = document.createElement("p")
      author.innerText = data.author
      let year = document.createElement("p")
      year.innerText = data.year
      let action = document.createElement("div")
      action.classList.add("action")
      let button1 = document.createElement("button")
      button1.classList.add("green")
      button1.innerText = "Selesai dibaca"
      let button2 = document.createElement("button")
      button2.classList.add("red")
      button2.innerText = "Hapus Buku"
      button1.addEventListener("click",()=>{
        isCompleteSwitch(data)
        document.dispatchEvent(new Event(REFRESH_DATA))
      })
      button2.addEventListener("click",()=>{
        deleteBook(data);
        document.dispatchEvent(new Event(REFRESH_DATA))
      })
      action.append(button1,button2)
      book_item.append(title,author,year,action)
      book_item.setAttribute("id",data.id)
      incompleteBookshelfList.append(book_item)
    }
    const finishedBook = (data) =>{
      let book_item = document.createElement('article')
      book_item.classList.add("book_item")
      let title = document.createElement("h3")
      title.innerText = data.title
      let author = document.createElement("p")
      author.innerText = data.author
      let year = document.createElement("p")
      year.innerText = data.year
      let action = document.createElement("div")
      action.classList.add("action")
      let button1 = document.createElement("button")
      button1.classList.add("green")
      button1.innerText = "Belum selesai di Baca"
      let button2 = document.createElement("button")
      button2.classList.add("red")
      button2.innerText = "Hapus Buku"
      action.append(button1,button2)

      button1.addEventListener("click",()=>{
        isCompleteSwitch(data)
        document.dispatchEvent(new Event(REFRESH_DATA))
      })
      button2.addEventListener("click",()=>{
        console.log("deleted")
        deleteBook(data);
        document.dispatchEvent(new Event(REFRESH_DATA))
      })
      book_item.append(title,author,year,action)
      book_item.setAttribute("id",data.id)
      completeBookshelfList.append(book_item)
    }

    //events
    isCompleteInput.addEventListener("click",(e)=>{
      status.innerText = (isCompleteInput.checked)
      ?"Selesai dibaca"
      :"Belum selesai dibaca"
    })
    let searchValue = ""
    searchBookTitle.addEventListener("input",(e)=>{
      searchValue = e.target.value
    })
    searchSubmit.addEventListener('click',(e)=>{
      e.preventDefault();
      if(searchBookTitle.value==null)return;
      document.dispatchEvent(new Event(REFRESH_DATA))
    })
    bookSubmit.addEventListener('click',(e)=>{
      e.preventDefault();
      console.log("submitted");
      if(
        !titleInput.value
        && !authorInput.value
        && !yearInput.value
      )return;
      let newBook = createJSON(
        +new Date(),
        titleInput.value,
        authorInput.value,
        yearInput.value,
        isCompleteInput.checked,
      )
      addDataToStorage(newBook)
    })

    document.addEventListener(REFRESH_DATA,()=>{
      console.log("refreshed")
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";
      //add data
      let data = getDataFromStorage()
      for(let i of data)
      {
        if(searchValue!=null)
        {
          if(i.title.startsWith(searchValue))
          {
            if(i.isComplete)
              finishedBook(i)
            else
              unfinishedBook(i)
            }
        }
        else
        {
          if(i.isComplete)
            finishedBook(i)
          else
            unfinishedBook(i)
        }
      }
    }
    )

    //belum dibaca isComplete = false
    //selesai dibaca isComplete = true
    //keduanya bisa mengubah data isComplete menjadi true or false
    //keduanya memiliki opsi hapus
    //memanfaatkan localStorage dalam menyimpan data buku
    document.dispatchEvent(new Event(REFRESH_DATA))
})
