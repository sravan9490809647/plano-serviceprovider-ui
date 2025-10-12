# React Native WebView Image Upload Guide

## Web Side (Already Implemented ✅)
The web application now detects WebView and uses `postMessage` to communicate with React Native.

## React Native Side Implementation

You need to add the following code to your React Native app:

### 1. Install Required Packages
```bash
npm install react-native-image-picker
# or
yarn add react-native-image-picker
```

For iOS, also run:
```bash
cd ios && pod install && cd ..
```

### 2. Add Permissions

#### iOS (ios/YourApp/Info.plist)
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to upload images</string>
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos</string>
```

#### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 3. Implement WebView with Image Picker

```javascript
import React, { useRef } from 'react';
import { View, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs'; // Optional: for file system access

const App = () => {
  const webViewRef = useRef(null);

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: true, // Important: we need base64 data
    };

    // Show action sheet to choose camera or gallery
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(options, handleImageResponse);
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(options, handleImageResponse);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to pick image');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      
      // Prepare data to send to WebView
      const imageData = {
        type: 'IMAGE_SELECTED',
        imageData: `data:${asset.type};base64,${asset.base64}`,
        fileName: asset.fileName || 'image.jpg',
        mimeType: asset.type || 'image/jpeg',
        fileSize: asset.fileSize,
      };

      // Send message to WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify(imageData));
      }
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'OPEN_IMAGE_PICKER') {
        handleImagePicker();
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://your-web-app-url.com' }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default App;
```

### 4. Alternative: Using ActionSheetIOS (iOS Only)

```javascript
import { ActionSheetIOS, Platform } from 'react-native';

const handleImagePicker = async () => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take Photo', 'Choose from Library'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          launchCamera(options, handleImageResponse);
        } else if (buttonIndex === 2) {
          launchImageLibrary(options, handleImageResponse);
        }
      }
    );
  } else {
    // Use Alert for Android (code above)
  }
};
```

### 5. Simplified Version (Gallery Only)

If you only need gallery access:

```javascript
import { launchImageLibrary } from 'react-native-image-picker';

const handleWebViewMessage = (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.type === 'OPEN_IMAGE_PICKER') {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: true,
        },
        (response) => {
          if (!response.didCancel && !response.errorCode && response.assets) {
            const asset = response.assets[0];
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'IMAGE_SELECTED',
                imageData: `data:${asset.type};base64,${asset.base64}`,
                fileName: asset.fileName || 'image.jpg',
                mimeType: asset.type || 'image/jpeg',
              })
            );
          }
        }
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Testing

1. Make sure your WebView has `javaScriptEnabled={true}`
2. Test on both iOS and Android devices
3. Check permissions are granted
4. Verify the image appears in the preview after selection

## Troubleshooting

### Issue: App crashes on image selection
- **Solution**: Check permissions in Info.plist (iOS) and AndroidManifest.xml (Android)
- Make sure `includeBase64: true` is set in options

### Issue: Image not appearing in WebView
- **Solution**: Check that `postMessage` is working correctly
- Verify the data format being sent matches what the web app expects

### Issue: "Cannot read property 'postMessage' of null"
- **Solution**: Make sure `webViewRef.current` exists before calling `postMessage`

### Issue: Large images causing memory issues
- **Solution**: Reduce `quality` and set `maxWidth`/`maxHeight` in options

## Notes
- Base64 encoding increases file size by ~33%
- For production, consider uploading images directly from native code
- You can compress images before sending to reduce size

