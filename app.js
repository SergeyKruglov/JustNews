new Vue({
  el: "#app",
  data: {
    query: "",
    page: "1",
    posts: [],
    pagesCount: ""
  },
  computed: {
    reqUrl: function () {
      return (
        'https://newsapi.org/v2/top-headlines?apiKey=a82e21ed62504b0bb2eb23aa916d739b&language=en'
        + `&q=${this.query}`
        + `&page=${this.page}`
      );
    }
  },
  methods: {
    loadData: function () {
      axios.get(this.reqUrl).then(response => {
        let postsData = response.data.articles.map(function(item) {
          return {
            title: item.title, 
            description: item.description, 
            url: item.url, 
            urlToImage: item.urlToImage,
            publishedAt: item.publishedAt
          };
        });
        this.posts = this.posts.concat(postsData);
        this.pagesCount = Math.ceil(response.data.totalResults / 20);
      });
    },
    handleScroll: function () {
      let scrollEnd = document.getElementById("app").clientHeight - window.innerHeight;
      let isBottom = scrollEnd == window.scrollY;
      let isNotLastPage = this.page < this.pagesCount;
      if (isBottom && isNotLastPage) {
        this.page++;
        this.loadData();
      }
    }
  },
  watch: {
    "query": function () {
      this.page = 1;
      this.posts = [];
      window.scrollTo(0, 0);
      this.loadData();
    }
  },
  mounted() {
    this.loadData();
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  }
});