//
//  DKRelationTests.m
//  DataKit
//
//  Created by Erik Aigner on 05.03.12.
//  Copyright (c) 2012 chocomoko.com. All rights reserved.
//

#import "DKRelationTests.h"

#import "DKEntity.h"
#import "DKQuery.h"
#import "DKRelation.h"
#import "DKManager.h"
#import "DKTests.h"

@implementation DKRelationTests

- (void)setUp {
  [DKManager setAPIEndpoint:kDKEndpoint];
  [DKManager setAPISecret:kDKSecret];
}

- (void)testRelationTopBarApp {
    NSString *entityBar = @"Bar";
    NSString *entityUser = @"User";
    NSString *entityBarCategory = @"BarCategory";
    NSString *entityComment = @"Comment";
    NSString *entityRating = @"Rating";
    NSString *entityBarPhotos = @"BarPhotos";
    
    //[DKEntity destroyAllEntitiesForName:entityName error:NULL];
    //[DKEntity destroyAllEntitiesForName:entityName2 error:NULL];
    
    //Get the entities from the db
    DKEntity *bar = [self getEntity:entityBar];
    DKEntity *user = [self getEntity:entityUser];
    DKEntity *barCategory = [self getEntity:entityBarCategory];
    DKEntity *comment = [self getEntity:entityComment];
    DKEntity *rating = [self getEntity:entityRating];
    DKEntity *barPhotos = [self getEntity:entityBarPhotos];
    
    //test entities
    NSLog(@"bar name: %@", [bar objectForKey:@"barName"]);
    NSLog(@"user name: %@", [user objectForKey:@"firstName"]);
    NSLog(@"category name: %@", [barCategory objectForKey:@"categoryName"]);
    NSLog(@"comment name: %@", [comment objectForKey:@"commentText"]);
    NSLog(@"rating: %@", [rating objectForKey:@"ratingValue"]);
    NSLog(@"bar photo name: %@", [barPhotos objectForKey:@"imageURL"]);
    
    //set relationships
    
    //User atBar and favoriteBars Relationship
    DKRelation *rel = [DKRelation relationWithEntity:bar];
    [user setObject:rel forKey:@"atBar"];
    [user save];
    
//    DKRelation *rel = [DKRelation relationWithEntity:e0];
//    [e1 setObject:rel forKey:@"relation"];
//    [e1 save];
    
    // Test stored relation decode
    DKQuery *q2 = [DKQuery queryWithEntityName:entityUser];
    [q2 whereKey:@"_id" equalTo:user.entityId];
    
    NSArray *results = [q2 findAll];
    
    XCTAssertEqual(results.count, (NSUInteger)1);
    
    DKEntity *user2 = [results lastObject];
    
    XCTAssertEqualObjects(user.entityId, user2.entityId);
    
    DKRelation *relTest = [user2 objectForKey:@"atBar"];
    
    XCTAssertEqualObjects(bar.entityId, relTest.entityId);
    XCTAssertEqualObjects(bar.entityName, relTest.entityName);
}

- (DKEntity *)getEntity:(NSString *)entity {
    NSArray *result = nil;
    
    DKQuery *q = [DKQuery queryWithEntityName:entity];
    //[q whereKeyExists:@"_id"];
    result = [q findAll];
    NSLog(@"result content: %@", [[result firstObject] objectForKey:@"_id"]);
    
    return [result firstObject];
}

- (void)testRelationStore {
  NSString *entityName = @"EntityOne";
  NSString *entityName2 = @"EntityTwo";
  
  [DKEntity destroyAllEntitiesForName:entityName error:NULL];
  [DKEntity destroyAllEntitiesForName:entityName2 error:NULL];
  
  NSDictionary *dataDict = [NSDictionary dictionaryWithObjectsAndKeys:@"a", @"x", @"b", @"y", nil];
  
  DKEntity *e0 = [DKEntity entityWithName:entityName];
  [e0 setObject:dataDict forKey:@"data"];
  [e0 save];
  
  DKEntity *e1 = [DKEntity entityWithName:entityName2];

  DKRelation *rel = [DKRelation relationWithEntity:e0];
  [e1 setObject:rel forKey:@"relation"];
  [e1 save];  
  
  // Test stored relation decode
  DKQuery *q = [DKQuery queryWithEntityName:entityName2];
  [q whereKey:@"_id" equalTo:e1.entityId];
  
  NSArray *results = [q findAll];
  
  XCTAssertEqual(results.count, (NSUInteger)1);
  
  DKEntity *e2 = [results lastObject];
  
  XCTAssertEqualObjects(e1.entityId, e2.entityId);
  
  DKRelation *rel2 = [e2 objectForKey:@"relation"];
  
  XCTAssertEqualObjects(e0.entityId, rel2.entityId);
  XCTAssertEqualObjects(e0.entityName, rel2.entityName);
  
  // Test key inclusion
  [q includeReferenceAtKey:@"relation"];
  [q includeReferenceAtKey:@"nonexistent"];
  
  results = [q findAll];
  
  XCTAssertEqual(results.count, (NSUInteger)1);
  
  e2 = [results lastObject];
  
  XCTAssertEqualObjects(e1.entityId, e2.entityId);
  
  NSDictionary *dict = [e2 objectForKey:@"relation"];
  
  XCTAssertEqualObjects([dict objectForKey:@"data"], dataDict);
  XCTAssertEqualObjects([dict objectForKey:@"_id"], e0.entityId);
}

@end
