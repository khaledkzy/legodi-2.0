import React from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import { Constants } from 'expo'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './ArticleStyle'
import Colors from '../../constants/Colors'
const { primaryColor, secondaryColor } = Colors

class Article extends React.Component {

  componentDidMount() {
    const { cities, cityId } = this.props
    const cityName = cities.filter(city => city.city_id === cityId)[0].city_name
    this.props.navigation.setParams({ cityName })
  }

  componentWillReceiveProps(nextProps) {
    const { cityId } = nextProps
    if (cityId !== this.props.cityId) {
      const cityName = this.props.cities.filter(city => city.city_id === cityId)[0].city_name
      this.props.navigation.setParams({ cityName })
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.cityId !== nextProps.cityId
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: params ? `${params.cityName} Welcome Pack` : 'Glasgow Welcome Pack',
      headerStyle: {
        backgroundColor: secondaryColor,
        paddingTop: Constants.statusBarHeight
      },
      headerTitleStyle: { color: primaryColor },
      headerTintColor: primaryColor
    }
  };

  render() {
    const language = this.props.navigation.getParam('language', 'en')
    const description = this.props.navigation.getParam(
      'description',
      'Default description'
    )
    const articleImage = this.props.navigation.getParam('articleImage')

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.center}>
            <Image
              style={styles.image}
              source={{ uri: articleImage ? `data:image/png;base64,${articleImage}` : 'http://placehold.it/300x200' }}
            />
          </View>
          <View style={[styles.center, { padding: 15 }]}>
            <Text style={language === 'ar' ? styles.arabicTitle : styles.title}>
              {this.props.navigation.getParam('title', 'Default Title')}
            </Text>
          </View>
          <View style={styles.paddingSides}>
            <Text
              style={
                language === 'ar'
                  ? styles.arabicDescription
                  : styles.description
              }
            >
              {description}
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  cityId: state.Setting.city,
  cities: state.cities.citiesList
})

Article.propTypes = {
  cityId: PropTypes.string,
  cities: PropTypes.array
}

export default connect(mapStateToProps, null)(Article)