//
//  NSData+DataKit.h
//  DataKit
//
//  Created by Erik Aigner on 26.02.12.
//  Copyright (c) 2012 chocomoko.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSData (Hex)

+ (NSData *)dataWithHexString:(NSString *)hex;
- (NSString *)hexString;

@end

@interface NSData (Base64)

+ (id)dataWithBase64String:(NSString *)string;
- (NSString *)base64String;

@end

@interface NSData (AES256)

- (NSData *)AES256EncryptWithKey:(NSData *)key UNAVAILABLE_ATTRIBUTE;
- (NSData *)AES256DecryptWithKey:(NSData *)key UNAVAILABLE_ATTRIBUTE;

@end