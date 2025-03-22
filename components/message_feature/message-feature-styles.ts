import { StyleSheet, Dimensions } from 'react-native';

// Kích thước màn hình
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container styles
  container: {
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 10,
    marginTop: 6,
  },
  
  // Weather styles
  weatherContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  weatherHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherCurrentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weatherCurrentInfo: {
    flex: 1,
  },
  weatherCurrentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#666',
  },
  weatherExtraInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  weatherExtraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  weatherExtraText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  weatherForecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherForecastItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    width: width / 5 - 15,
  },
  weatherForecastDay: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherForecastTemp: {
    fontSize: 14,
  },
  
  // Map styles
  mapContainer: {
    height: 200, // Giảm chiều cao xuống
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Places styles
  placesContainer: {
    marginBottom: 10,
  },
  placesList: {
    paddingHorizontal: 10,
  },
  placeItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  placeImageContainer: {
    width: 100,
    height: 100,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  placeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeRatingText: {
    fontSize: 14,
    color: '#f5a623',
    marginLeft: 5,
  },
  loadMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#3498db',
    fontWeight: '500',
  },
  
  // Direction styles
  directionContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  directionInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  directionAddressContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  directionAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  directionMapContainer: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  directionMap: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Utility styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}); 