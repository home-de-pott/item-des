import React from 'react'
import ReactDOM from 'react-dom'
import StarRatings from 'react-star-ratings';
import axios from 'axios'
import allItems from '../DataBase/allItems'
import { error } from 'util';
import { throws } from 'assert';
const font ={
    fontSize: '2.0vw'
}
class Itemsview extends React.Component {
    constructor(props){
        super(props)
        this.state={
            id: '',
            imagesArray:[],
            carouselImagesArray:[],
            theClickedImg : '',
            brand: '',
            name: '',
            descrbtionArray: [],
            price: 0,
            quantity: 1,
            ratingArray: [],
            ratingAvg:0,
            isWidthToSmall: false,
            frequentlyBoughtTogetherArray:[],
            allItemDroplest:[]
        }
    }
        
    

    componentDidMount(){
        this.allAitemDropdownList()
        window.addEventListener('resize', (resize)=>{
            if(resize.currentTarget.innerWidth < 992){
                 this.setState({isWidthToSmall: true})
            }else{
                this.setState({isWidthToSmall: false})
            }
        })
       
        if(this.state.id === ''){
            this.getData(window.location.pathname.slice(10))
            this.getReview(window.location.pathname.slice(10))
        }
        window.addEventListener('updatePath', (e) => {
            this.getData(e.detail.id)
            this.getReview(e.detail.id)
        })
       
        
 
    }   

    getReview(id){
        axios.get(`http://homedepottreviews.us-east-2.elasticbeanstalk.com/reviews/${id}`)
        .then((Response)=> {return Response})
        .then((Response)=> {
            this.setState({ratingArray: Response.data.map(item=> item.rating)})
            this.setState({ratingAvg: this.getAvgRating(this.state.ratingArray)})
        })
        .catch((error)=> console.log(error))
    }

    getAvgRating(ratingArray){
        let sum =0;
        for(let i = 0; i<ratingArray.length;i++){
            sum =sum +ratingArray[i]
        }
        return sum/ratingArray.length;
    }

    getData(id){

        axios.get(`/items-data/${id}`)
        .then((Response)=>{
            const htmlImages = this.gitImages(Response.data[1]);
            const carouselImages = this.gitImagesCarousel(Response.data[1]);
            const frequentlyBoughtTogether = this.gitfrequentlyBoughtTogether(Response.data[2],Response.data[3],Response.data[0].id);
            const itemInfo = Response.data[0]
            const desc = this.getDescrption(itemInfo[0].Description)
            this.dataMunt(htmlImages,itemInfo,desc,id,carouselImages,frequentlyBoughtTogether,Response.data[1][0].img_src)
            return Response})
        .then((Response)=>{this.setState({ })})
        .catch((error)=>console.log(error));
        
   
    }

    gitfrequentlyBoughtTogether(info,images,id){
        const infoNew =[]
        info.map((item,index)=> item.src=images[index])
        for(let i =0; i<info.length;i++){
            if(info[i].id !== id && infoNew.length <3){
                infoNew.push(info[i])
            }
        }
        return infoNew;
       
    }

    gitImagesCarousel(Response){
        Response =  Response.map(item=>item.img_src)
   return Response;
    }

    gitImages(Response){
        Response =  Response.map(item=> <img className='img-thumbnail' onClick={()=>this.onImegeClick(item.img_src)}
             src={item.img_src}  width='60%'></img>)
        return Response;
    }

    getDescrption(description){
    description = description.split(';').map(item=> <li >{item}</li>)
        return description;
    }
    

    dataMunt(htmlImages,itemInfo,desc,id,carouselImages,frequentlyBoughtTogether,mainImage){
        this.setState({
            imagesArray: htmlImages,
            brand: itemInfo[0].brand,
            name: itemInfo[0].name,
            price: itemInfo[0].price,
            descrbtionArray: desc,
            id: id,
            carouselImagesArray: carouselImages,
            frequentlyBoughtTogetherArray:frequentlyBoughtTogether,
            theClickedImg:mainImage
        })
    }


    onImegeClick(imagePath){
        if(imagePath !== this.state.theClickedImg){
            this.setState({theClickedImg : imagePath})    
        }
    }

    onImegeClickRender(id){
       
        window.dispatchEvent(
			new CustomEvent('updatePath', {
				detail: {id: id},
			})
		)   
    }

    incres(){
        this.state.quantity++;
        this.setState({quantity: this.state.quantity++})
    }


    decres(){
        if(this.state.quantity !== 1){
            this.state.quantity--;
            this.setState({quantity: this.state.quantity})
        }
    }

    addToCart(){
        window.dispatchEvent(
			new CustomEvent('addToCart', {
				detail: {id: this.state.id , quantity: this.state.quantity},
			})
        )
        this.setState({quantity:1})
    }

    addAllItemsToCart(){
        const AllItems =[this.state.id,this.state.frequentlyBoughtTogetherArray[0].id,this.state.frequentlyBoughtTogetherArray[1].id]
        window.dispatchEvent(
			new CustomEvent('addItemsToCart', {
				detail: {ids: AllItems},
			})
        )
    }
    fullSizeScreen(){
        return      <div>    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <h6 >Internet #{this.state.id}</h6>
        
        {this.state.imagesArray}
    </div>
   
    <div id='mainImage' className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <h6 > Model # DWHT51054 SKU #1001209802</h6>

        <img default-src='none' src={this.state.theClickedImg} width='80%'></img> 
    </div></div>          
    }


    phoneSizeImage(){
        return <><div id="IbrahimmyCarousel" className="carousel slide" data-ride="carousel">
  
        <ol className="carousel-indicators">
          <li data-target="#IbrahimmyCarousel" data-slide-to="0" className="active"></li>
          <li data-target="#IbrahimmyCarousel" data-slide-to="1"></li>
          <li data-target="#IbrahimmyCarousel" data-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="item active">
            <img src={this.state.carouselImagesArray[0]} alt="0"></img>
          </div>
      
         <div className="item">
            <img src={this.state.carouselImagesArray[1]} alt="1"></img>
          </div>
      
          <div className="item">
            <img src={this.state.carouselImagesArray[2]} alt="2"></img>
          </div>
        </div>
        <a className="left carousel-control" href="#IbrahimmyCarousel" data-slide="prev">
    <span className="glyphicon glyphicon-chevron-left"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="right carousel-control" href="#IbrahimmyCarousel" data-slide="next">
    <span className="glyphicon glyphicon-chevron-right"></span>
    <span className="sr-only">Next</span>
  </a>
</div></>
    }

    frequentlyBoughtTogetherRender(){
        return <>
            <div  className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-2">
                <img
             src={this.state.theClickedImg}  width='60%'></img>
             <h6 >{this.state.name}</h6>
                    </div>
                    
                    <div className="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
                        <h2 style={{marginTop:'50px'}}>+</h2>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-2">
                <img onClick={()=>this.onImegeClickRender(this.state.frequentlyBoughtTogetherArray[0].id)}
             src={this.state.frequentlyBoughtTogetherArray[0].src}  width='60%'></img>
             <h6 >{this.state.frequentlyBoughtTogetherArray[0].name}</h6>
                    </div>
                    <div className="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
                        <h2 style={{marginTop:'50px'}}>+</h2>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-2">
             <img onClick={()=>this.onImegeClickRender(this.state.frequentlyBoughtTogetherArray[1].id)}
             src={this.state.frequentlyBoughtTogetherArray[1].src}  width='60%'></img>
             <h6 >{this.state.frequentlyBoughtTogetherArray[1].name}</h6>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-2"  >
                           <h3 style={{marginLeft: '5px',marginLeft: '20px' ,marginTop:'60px'}} type='text'>${this.state.price+this.state.frequentlyBoughtTogetherArray[0].price+this.state.frequentlyBoughtTogetherArray[1].price}</h3>

                        <form style={{alignItems:'center',marginRight: 'auto',marginLeft: '20px'}}>
                            <input  style={{backgroundColor:"#f96302" ,color :'#fff'  ,width:'170px',marginRight: 'auto',marginLeft: '5px', height:'35px'}} onClick={()=>this.addAllItemsToCart()} type='button' value='Add all items to cart' ></input>

                        </form>
                        </div>

        </>
    }
    allAitemDropdownList(){
    let itemsToRend=allItems.map((item)=><li onClick={()=>{window.dispatchEvent(
        
        new CustomEvent('updatePath', {
            detail: {id:item.id},
        })
        )}}><a>{item.name}</a></li>)
        this.setState({allItemDroplest:itemsToRend})
    }
    render(){
        
        return(
          
            <div className="container-fluid" style={{margin:'20px'}}>
               
                  <div className="dropdown row">
  <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
  Select an Item
    <span className="caret"></span>
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
{this.state.allItemDroplest}
 
  </ul>

            </div>
                <div className="row" style={{margin:'20px'}}>
                    {this.state.isWidthToSmall?this.phoneSizeImage():this.fullSizeScreen()}

                    <div className="col-xl-3 col-lg-3 col-md-3 col-ms-3" >
                        <h4 ><strong>{this.state.brand}</strong></h4>
                        <h4  > {this.state.name} </h4>
                        <StarRatings
                        rating={this.state.ratingAvg}
                        starRatedColor="#f96302"
                        starDimension="20px"
                        starSpacing="2px"
                        />
                        <h5  >Write a Review</h5>
                        <h5 >Questions & Answers ({this.state.ratingArray.length})</h5>
                        <ul>
                            {this.state.descrbtionArray}
                        </ul>
                        <h3  >${this.state.price}</h3>
                        <img style={{maxWidth: '20px',width:'15%'}} src="https://assets.homedepot-static.com/p/static/images/icons/Credit-Card_Icon.svg"></img>
                        <h6 ><strong>Save up to $100♢</strong> on your qualifying purchase.
                        Apply for a Home Depot Consumer Card</h6>
                        <form margin='10px' >
                            <input style={{maxWidth: '25px' }} onClick={()=>this.decres()} type='button' value='-'></input>
                            <input style={{maxWidth: '20px' }} type='text' min='1' value={this.state.quantity}></input>
                            <input style={{maxWidth: '25px' }} onClick={()=>this.incres()} type='button' value='+'></input>
                            <input style={{maxWidth:'100px',width: '50%', backgroundColor:"#f96302" ,color :'#fff'}} onClick={()=>this.addToCart()} type='button' value='Add to cart' ></input>
                        </form>
                    </div>
                </div >
                <div>
                    <h2 >Frequently Bought Together</h2>
                    <hr></hr>
                </div>
                <div className='row'>
                
                </div>
            <div className='row'>
                {this.state.frequentlyBoughtTogetherArray.length>1?this.frequentlyBoughtTogetherRender():<div></div>}

            </div>
        
        </div>
        )
    }
}

ReactDOM.render(<Itemsview />, document.getElementById('product'))