import Role from '../../src/aws/role'

describe('Role', () => {
  it('creates CF resource', () => {
    const r = new Role({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'MyTableResource'
    })

    const j = r.toJSON()

    expect(j).toHaveProperty('serviceDynamoDBAutoscaleRoleMyTableResourceIndexStageRegion')
  })

  it('supports china region', () => {
    const r = new Role({
      index: 'index',
      region: 'cn-north',
      service: 'service',
      stage: 'stage',
      table: 'MyTableResource'
    })

    const j = r.toJSON()

    expect(j).toHaveProperty('serviceDynamoDBAutoscaleRoleMyTableResourceIndexStageCnnorth')
    expect(j.serviceDynamoDBAutoscaleRoleMyTableResourceIndexStageCnnorth.Properties
      .Policies[0].PolicyDocument.Statement[1].Resource)
      .toEqual({'Fn::Join': ['', ['arn:', {Ref: 'aws-cn'}, ':dynamodb:*:',
      {Ref: 'AWS::AccountId'}, ':table/', {Ref: 'MyTableResource'}]]})
  })

  it('truncates role name if needed', () => {
    const r = new Role({
      index: 'index',
      region: 'region',
      service: 'service-with-a-long-name-to-force-truncation',
      stage: 'stage',
      table: 'MyTableResource'
    })

    const j = r.toJSON()

    expect(j).toHaveProperty('servicewithalongnametoforcetrunc81d5364e64588e2b095c450722c20a24')
  })
})
