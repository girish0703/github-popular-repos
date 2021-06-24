import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here
class GithubPopularRepos extends Component {
  state = {isLoading: true, repositoriesData: [], selectedLanguageFilter: 'ALL'}

  componentDidMount() {
    this.getRepositories(languageFiltersData[0].id)
  }

  setRepositories = (fetchedData, loadingStatus) => {
    this.setState({
      repositoriesData: fetchedData,
      isLoading: loadingStatus,
    })
  }

  setIsLoading = loadingStatus => {
    this.setState({isLoading: loadingStatus})
  }

  getRepositories = async selectedLanguageFilter => {
    this.setIsLoading(true)
    const response = await fetch(
      `https://apis.ccbp.in/popular-repos?language=${selectedLanguageFilter}`,
    )
    const fetchedData = await response.json()
    const updatedData = fetchedData.popular_repos.map(eachRepository => ({
      id: eachRepository.id,
      imageUrl: eachRepository.avatar_url,
      name: eachRepository.name,
      starsCount: eachRepository.stars_count,
      forksCount: eachRepository.forks_count,
      issuesCount: eachRepository.issues_count,
    }))
    this.setRepositories(updatedData, false)
  }

  setSelectedLanguageFilterAndGetRepositories = newFilterId => {
    this.setState({selectedLanguageFilter: newFilterId})
    this.getRepositories(newFilterId)
  }

  render() {
    const {selectedLanguageFilter, isLoading, repositoriesData} = this.state
    return (
      <div className="app-container">
        <div className="content-container">
          <h1 className="heading">Popular</h1>
          <ul className="filters-list-container">
            {languageFiltersData.map(eachLanguageFilter => (
              <LanguageFilterItem
                isSelected={eachLanguageFilter.id === selectedLanguageFilter}
                key={eachLanguageFilter.id}
                languageFilter={eachLanguageFilter}
                setSelectedLanguageFilterAndGetRepositories={
                  this.setSelectedLanguageFilterAndGetRepositories
                }
              />
            ))}
          </ul>
          {isLoading ? (
            <div testid="loader">
              <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
            </div>
          ) : (
            <ul className="repositories-cards-list-container">
              {repositoriesData.map(repositoryData => (
                <RepositoryItem
                  key={repositoryData.id}
                  repositoryData={repositoryData}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
