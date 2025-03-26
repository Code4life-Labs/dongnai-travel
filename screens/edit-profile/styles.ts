import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      coverPhotoContainer: {
        height: 150,
        width: '100%',
        position: 'relative',
      },
      coverPhoto: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
      },
      placeholderCover: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      editCoverButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        marginLeft: 16,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
      },
      avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      placeholderAvatar: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      editAvatarButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      placeholderText: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
      },
      form: {
        padding: 16,
        marginTop: 30,
      },
      inputGroup: {
        marginBottom: 16,
      },
      label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
      },
      input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
      },
      textArea: {
        height: 100,
        textAlignVertical: 'top',
      },
      submitButton: {
        marginTop: 24,
        marginBottom: 80,
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: 100,
        marginRight: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default styles