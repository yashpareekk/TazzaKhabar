import React, { Component } from "react";
import NewsItem from "./NewsItem";
import loading, { Spinner } from "./Spinner";
import PropTypes from 'prop-types'


export class News extends Component {
  static defaultProps={
    country:'in',
    pageSize:8,
    category:'general',
  }
  static propTypes={
    country:PropTypes.string,
    pageSize:PropTypes,
    category:PropTypes.string,
  }
  constructor(props) {
    super(props);
    // console.log("hello this is a constructer");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title=`${this.props.category}-Taaza Khabar`
  }
  async componentDidMount() {
    let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1f984a882b624fac8b115e8b59f04aff&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    let passedData = await data.json();
    console.log(passedData);
    this.setState({ articles: passedData.articles,
      totalResults:passedData.totalResults, 
      loading: false
    });
  }

  previousClick = async () => {
    console.log("previous");
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1f984a882b624fac8b115e8b59f04aff&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    let passedData = await data.json();
    console.log(passedData);
    this.setState({
      page: this.state.page - 1,
      articles: passedData.articles,
      loading:false
    });
  };
  nextClick = async () => {
    console.log("next");
    if (!(this.state.page + 1> Math.ceil (this.state.totalResults/this.props.pageSize))){
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&apiKey=1f984a882b624fac8b115e8b59f04aff&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true})
      let data = await fetch(url);
      let passedData = await data.json();
      this.setState({
        page: this.state.page + 1,
        articles: passedData.articles,
        loading:false,
      });
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'40px 0px'}}><b>Top {(this.props.category)} Headlines</b></h1>
        {this.state.loading&&<Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : " "}
                  description={
                    element.description ? element.description.slice(0, 88) : " "
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url} author={element.author} date={element.publishedAt}
                />
              </div>
            );
          })}
        </div>
        <div className="container d-flex justify-content-evenly">
          <button
            disabled={this.state.page <= 1}
            type="button"
           className="btn btn-dark"
            onClick={this.previousClick}
          >
            &larr; Previous
          </button>
          <button disabled={(this.state.page + 1> Math.ceil (this.state.totalResults/this.props.pageSize))} type="button"className="btn btn-dark" onClick={this.nextClick}>
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
