import boto3

# Change the following variables to match your needs
s3_bucket = "threatmonitor-assessment-logs" # S3 bucket name
output_file = "Results.txt" # Output file name

try:
    s3 = boto3.resource('s3') # Create an S3 resource using aws-cli configuration

    bucket = s3.Bucket(s3_bucket) # Get the bucket

    # Iterate through all the objects
    for obj in bucket.objects.all():
        key = obj.key # Get the name of the file
        body = obj.get()['Body'].read() # Get the contents of the file
        body_str = body.decode('utf-8')  # Decode the bytes to a string
        line_count = body_str.count('\n') - 1  # Count the number of lines. Subtract 1 for headers line.
        with open(output_file, "a") as f:
            f.write(key + ": " + str(line_count) + " Lines or Logs" + "\n----------------\n")

except Exception as e:
    print("An error occurred:", str(e))